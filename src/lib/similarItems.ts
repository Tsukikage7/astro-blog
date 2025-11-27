const similerItems = (currentItem: any, allItems: any, id: string) => {
  let categories: string[] = [];
  let tags: string[] = [];

  
  if (currentItem.data?.categories?.length > 0) {
    categories = currentItem.data.categories;
  }

  
  if (currentItem.data?.tags?.length > 0) {
    tags = currentItem.data.tags;
  }

  
  const filterByCategories = allItems.filter((item: any) =>
    categories.find((category) => item.data.categories.includes(category)),
  );
  
  
  const filterByTags = allItems.filter((item: any) =>
    tags.find((tag) => item.data.tags.includes(tag)),
  );

  
  const mergedItems = [...filterByCategories, ...filterByTags];

  
  const filterByID = mergedItems.filter((item) => item.id !== id);

  
  const itemCount = filterByID.reduce((accumulator: any, currentItem: any) => {
    accumulator[currentItem.id] = (accumulator[currentItem.id] || 0) + 1;
    return accumulator;
  }, {});

  
  const sortedItems = filterByID.sort((a: any, b: any) => itemCount[b.id] - itemCount[a.id]);

  
  const filteredItems = sortedItems.filter((item: any) => itemCount[item.id] > 1);

  
  const uniqueItems = [...new Set(filteredItems.map((item: any) => item.id))].map((id: string) => {
    return filteredItems.find((item: any) => item.id === id);
  });

  return uniqueItems;
};

export default similerItems;