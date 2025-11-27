
const readingTime = (content: string, complexity: number): string => {
  if(!content) {
    return '0分钟';
  }
  
  const CPS = 350 / 60; 

  let images = 0;
  
  const chineseRegex = /[\u4e00-\u9fa5]/g;
  const englishRegex = /[a-zA-Z0-9]/g;

  
  const imageRegex = /\.(png|jpg|jpeg|svg|webp|gif)/gi;
  const imageMatches = content.match(imageRegex);
  images = imageMatches ? imageMatches.length : 0;

  
  const chineseChars = content.match(chineseRegex);
  const chineseCount = chineseChars ? chineseChars.length : 0;

  
  const englishChars = content.match(englishRegex);
  const englishWordCount = englishChars ? Math.ceil(englishChars.length / 5) : 0;

  
  const totalChars = chineseCount + englishWordCount;

  let imageSecs = 0;
  let imageFactor = 12;

  while (images) {
    imageSecs += imageFactor;
    if (imageFactor > 3) {
      imageFactor -= 1;
    }
    images -= 1;
  }

  let ttr = 0; 
  ttr = totalChars / CPS;
  ttr = ttr + imageSecs;
  ttr = ttr * complexity;
  ttr = Math.ceil(ttr / 60);

  
  if (ttr < 1) {
    ttr = 1;
  }

  return ttr + `分钟`;
};

export default readingTime;
