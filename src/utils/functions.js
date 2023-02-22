function ImageReplace(image) {
  return image.replace(
    'https://image-assets-bucket.s3.ap-south-1.amazonaws.com/',
    'http://ec2-35-175-134-9.compute-1.amazonaws.com/',
  );
}

function isObjectEmpty(value) {
  return (
    Object.prototype.toString.call(value) === '[object Object]' &&
    JSON.stringify(value) === '{}'
  );
}

function findItem(value, data, check) {
  let obj = check == 'n' ? {name: value} : {title: value};

  if (data.length > 0) {
    const findIndex =
      check == 'n'
        ? data.findIndex(x => x.name === value)
        : data.findIndex(x => x.title === value);
    if (findIndex > -1) obj = data[findIndex];
  }

  return obj;
}

export const functions = {ImageReplace, isObjectEmpty, findItem};
