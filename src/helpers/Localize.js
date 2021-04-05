class Localize {
  static getWeekDayName(weekDay) {
    return weekDay
      .replace(/Saturday/g, 'شنبه')
      .replace(/Sunday/g, 'یک‌شنبه')
      .replace(/Monday/g, 'دوشنبه')
      .replace(/Tuesday/g, 'سه‌شنبه')
      .replace(/Wednesday/g, 'چهارشنبه')
      .replace(/Thursday/g, 'پنج‌شنبه')
      .replace(/Friday/g, 'جمعه')
      .replace(/Sat/g, 'ش')
      .replace(/Sun/g, 'ی')
      .replace(/Mon/g, 'د')
      .replace(/Tue/g, 'س')
      .replace(/Wed/g, 'چ')
      .replace(/Thu/g, 'پ')
      .replace(/Fri/g, 'ج');
  }

  static getMonthName(month) {
    return month
      .replace(/Farvardin/g, 'فروردین')
      .replace(/Ordibehesht/g, 'اردیبهشت')
      .replace(/Khordad/g, 'خرداد')
      .replace(/Tir/g, 'تیر')
      .replace(/Mordad/g, 'مرداد')
      .replace(/Shahrivar/g, 'شهریور')
      .replace(/Mehr/g, 'مهر')
      .replace(/Aban/g, 'آبان')
      .replace(/Azar/g, 'آذر')
      .replace(/Dey/g, 'دی')
      .replace(/Bahman/g, 'بهمن')
      .replace(/Esfand/g, 'اسفند');
  }

  static toPersianString(string) {
    return string
      .replace(/1/g, '۱')
      .replace(/2/g, '۲')
      .replace(/3/g, '۳')
      .replace(/4/g, '۴')
      .replace(/5/g, '۵')
      .replace(/6/g, '۶')
      .replace(/7/g, '۷')
      .replace(/8/g, '۸')
      .replace(/9/g, '۹')
      .replace(/0/g, '۰');
  }
}

export default Localize;
