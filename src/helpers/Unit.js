class Unit {
  static sign = (unit) => {
    switch (unit) {
      case 'standard':
        return ' ' + 'K';
      case 'metric':
        return ' ' + '℃';
      case 'imperial':
        return ' ' + '℉';
    }
  };

  static speed = (unit) => {
    switch (unit) {
      case 'standard':
        return 'm/s';
      case 'metric':
        return 'm/s';
      case 'imperial':
        return 'mph';
    }
  };
}
export default Unit;
