export default function ConvertToPersianDigit(value: any) {
  return value?.toString().replace(/\d/g, (d: any) => '۰۱۲۳۴۵۶۷۸۹'[d]) || '';
}
