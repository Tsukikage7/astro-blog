---
title: Wire实现Golang依赖注入
description: Wire实现Golang依赖注入
created: 2024-08-06 05:56:21
updated: 2024-08-06 05:56:21
image: "https://assets.tsukikage7.com/blog/cover/893db273.webp"
categories:
  - 后端开发
tags:
  - 开发
  - Golang
---

# Wire实现Golang依赖注入

## 一、什么是依赖注入

简单来说,就是在项目开发中,我们经常遇到一直情况,实例A的创建会依赖于实例B的创建,并且在实例A的生命周期内,持有对实例B的访问权限。

## 二、为什么要使用依赖注入

如果不适用依赖注入的话会有以下风险:

1. 全局变量⼗分不安全,存在覆写的可能。
2. 资源散落在各处,可能重复创建,浪费内存,后续维护能⼒极差。
3. 提⾼循环依赖的⻛险。
4. 全局变量的引⼊提⾼单元测试的成本

在使用依赖注入后,可以方便我们的代码进行维护。

## 三、Golang依赖注入

目前来说我的解决方案是通过Google的`Wire`去实现Golang依赖注入

Wire对比与其他在运行阶段依靠反射实现依赖注入的方式来说,优势在于能在编译期实现依赖注入,如果依赖注⼊有问题,那么在代码⽣成时就会抛出异常,并不会拖到运⾏时暴露,更便于我们进行debug。

### 3.1 安装Wire

```bash
go install github.com/google/wire/cmd/wire@latest
```

### 3.2 代码实现

```go
func initWebServer() *gin.Engine {
	wire.Build(
		ioc.InitDB,
		ioc.InitRedis,
		dao.NewUserDao,
		cache.NewUserCache,
		cache.NewCodeCache,
		repository.NewUserRepository,
		repository.NewCodeRepository,
		service.NewUserService,
		service.NewCodeService,
		ioc.InitSmsService,
		web.NewUserHandler,
		ioc.InitGin,
		ioc.InitMiddlewares,
	)
	return &gin.Engine{}, nil
}
```

### 3.3 Provider提供者

`Provider`是一个普通有返回值的 Go 函数,它负责创建一个对象或者提供依赖。在 `wire` 的上下文中,提供者可以是任何返回一个或多个值的函数。这些返回值将成为注入器函数的参数。Provider函数通常负责初始化组件,比如数据库连接、服务实例等。并且提供者的返回值不仅限于一个,如果有需要的话,可以额外添加一个 `error` 的返回值。

```go
func InitDB() *gorm.DB {
	db, err := gorm.Open(mysql.Open(config.Config.DB.DSN))
	if err != nil {
		panic(err)
	}
	err = dao.InitTable(db)
	if err != nil {
		panic(err)
	}
	return db.Debug()
}
```

Provider函数可以分组为*provider set*。使用`wire.NewSet` 函数可以将多个Provider添加到一个集合中。

举个例子,例如将 `user` 相关的 `handler` 和 `service` 以及`repo`进行组合:

```go
var UserProvider = wire.NewSet(
	cache.NewUserCache,
	dao.NewUserDao,
	repository.NewUserRepository,
	service.NewUserService,
	web.NewUserHandler,
)
```

使用 `wire.NewSet` 函数将提供者进行分组,该函数返回一个 `ProviderSet` 结构体。不仅如此,`wire.NewSet` 还能对多个 `ProviderSet` 进行分组 `wire.NewSet(UserSet, XxxSet) `。

```go
var ServerProvider = wire.NewSet(
	UserProvider,
	CodeProvider,
	WebProvider,
)
```

### 3.4 Injectors注入器

注入器（`injectors`）的作用是将所有的提供者（`providers`）连接起来,要声明一个注入器函数只需要在函数体中调用`wire.Build()`。这个函数的返回值也无关紧要,只要它们的类型正确即可。

```go
func InitWebServer() *gin.Engine {
	wire.Build(
		BaseProvider,
		UserProvider,
		CodeProvider,
		WebProvider,
	)
	return new(gin.Engine)
}
```

在这个例子中,`InitWebServer` 是一个注入器,它依赖 `BaseProvider`、`UserProvider`、`CodeProvider`、`WebProvider`这四个提供者。

与提供者一样,注入器也可以输入参数（然后将其发送给提供者）,并且可以返回错误。

`wire.Build`的参数和`wire.NewSet`一样: 都是Provider集合。这些就在该注入器的代码生成期间使用的`Provider Set`。

### 3.5 绑定接口

依赖项注入通常用于绑定接口的具体实现。`wire`通过类型标识将输入与输出匹配,因此倾向于创建一个返回接口类型的提供者。然而,这也不是习惯写法,因为Go的最佳实践是返回具体类型。你可以在提供者集中声明接口绑定:

```go
wire.Bind(new(dao.UserDao), new(*dao.GormUserDao))
```

### 3.6 绑定结构体

`Wire` 库有一个函数是 `wire.Struct`,它能根据现有的类型进行构造结构体,我们来看看下面的例子:

`wire.Struct`的第一个参数是指向所需结构体类型的指针,随后的参数是要注入的字段的名称。可以使用一个特殊的字符串“_”作为快捷方式,告诉注入器注入结构体的所有字段。在这里使用`wire.Struct(new(User), "_")`会产生和上面相同的结果。

```go
type User struct {
	Name string
	mu   sync.Mutex `wire:"-"`
}

func ProvideName(u *User) {
	u.Name = "wire"
}
func InitializeUser() *User {
	wire.NewSet(
		ProvideName,
		wire.Struct(new(User), "Name"),
	)
	return &User{}
}
```

你使用`wire.Struct(new(User), "*")`提供`User`类型时,`wire`将自动省略`mu`字段。此外,在`wire.Struct(new(Foo), "mu")`中显式指定被忽略的字段也会报错。

### 3.7 绑定值

有时,将基本值（通常为nil）绑定到类型是有用的。你可以向提供程序集添加一个值表达式,而不是让注入器依赖于一次性提供者函数。

```go
type User struct {
    Value int
}

func injectValue() User {
    wire.Build(wire.Value(User{Value: 100}))
    return User{}
}
```

值得注意的是,表达式将被复制到注入器的包中；对变量的引用将在注入器包的初始化过程中进行计算。如果表达式调用任何函数或从任何通道接收任何函数,`wire` 将会报错。

对于接口值,使用 `InterfaceValue`:

```go
func injectReader() io.Reader {
    wire.Build(wire.InterfaceValue(new(io.Reader), os.Stdin))
    return nil
}
```

### 3.8 使用结构体字段作为Provider

```go
func GetName() string {
	wire.Build(
		wire.FieldsOf(new(User), "Name"),
	)
	return ""
}
```

### 3.9 清理函数

如果一个`Provider`创建了一个需要清理的值（例如关闭一个文件）,那么它可以返回一个闭包来清理资源。注入器会用它来给调用者返回一个聚合的清理函数,或者在注入器实现中稍后调用的提供商返回错误时清理资源。

```go
func provideFile(log Logger, path Path) (*os.File, func(), error) {
    f, err := os.Open(string(path))
    if err != nil {
        return nil, nil, err
    }
    cleanup := func() {
        if err := f.Close(); err != nil {
            log.Log(err)
        }
    }
    return f, cleanup, nil
}
```
