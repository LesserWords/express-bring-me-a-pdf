function formatDate(dateTime) {
  const formatedDate = new Date(dateTime).toLocaleDateString("pt-BR");
  return formatedDate;
}

function formatPhone(value) {
  let masked = value;
  // if (phoneType === 0 || phoneType === 1 || phoneType === 2) {
  // console.log(masked);
  if (!masked) {
    return "Sem telefone";
  } else if (typeof value === "string" && !Number.isNaN(parseInt(value))) {
    const numberString = value.toString();
    switch (numberString.length) {
      case 8:
        masked =
          numberString.substring(0, 4) +
          "-" +
          numberString.substring(4, numberString.length);
        break;
      case 9:
        masked =
          numberString.substring(0, 5) +
          "-" +
          numberString.substring(5, numberString.length);
        break;
      case 10:
        masked =
          "(" +
          numberString.substring(0, 2) +
          ")" +
          numberString.substring(2, 6) +
          "-" +
          numberString.substring(6, 9) +
          numberString.substring(9, numberString.length);
        break;
      case 11:
        masked =
          "(" +
          numberString.substring(0, 2) +
          ")" +
          numberString.substring(2, 7) +
          "-" +
          numberString.substring(7, 9) +
          numberString.substring(9, numberString.length);
        break;
      default:
        masked = numberString;
        break;
    }
  }
  // }
  return masked;
}

module.exports = { formatDate, formatPhone };
