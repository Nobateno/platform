import _ from "lodash";

export interface User {
  id: string;
  name: string;
  position: string;
  photo?: string;
  email: string;
  phone: string;
  department: string;
  location: string;
  joinedDate: string;
  manager: string;
  addressLine1: string;
  addressLine2: string;
  isActive: boolean;
}

const fakers = {
  fakeUsers() {
    const users: Array<User> = [
      {
        id: "abc",
        name: "تام هنکس",
        position: "مدیر فروش",
        email: "tom.hanks@left4code.com",
        phone: "+1 (123) 456-7890",
        department: "دپارتمان فروش",
        location: "نیویورک، آمریکا",
        joinedDate: "۱۵ ژانویه ۲۰۱۰",
        manager: "جان اسمیت",
        addressLine1: "خیابان اصلی 123",
        addressLine2: "واحد 456",
        isActive: true,
      },
      {
        id: "bcd",
        name: "مریل استریپ",
        position: "هماهنگ‌کننده بازاریابی",

        email: "meryl.streep@left4code.com",
        phone: "+۱ (۲۳۴) ۵۶۷-۸۹۰۱",
        department: "دپارتمان بازاریابی",
        location: "لس‌آنجلس، آمریکا",
        joinedDate: "۲۲ مارس ۲۰۱۵",
        manager: "الیس جانسون",
        addressLine1: "خیابان الم 456",
        addressLine2: "طبقه 3B",
        isActive: false,
      },
      {
        id: "cde",
        name: "لئوناردو دی‌کاپریو",
        position: "کارشناس پشتیبانی",
        email: "leonardo.dicaprio@left4code.com",
        phone: "+۱ (۳۴۵) ۶۷۸-۹۰۱۲",
        department: "تیم پشتیبانی",
        location: "شیکاگو، ایالات متحده",
        joinedDate: "۵ مه ۲۰۱۸",
        manager: "امیلی دیویس",
        addressLine1: "خیابان اوک ۷۸۹",
        addressLine2: "آپارتمان ۱۰۲",
        isActive: true,
      },
      {
        id: "def",
        name: "آنجلینا جولی",
        position: "مدیر اجرایی حساب",
        email: "angelina.jolie@left4code.com",
        phone: "+۱ (۴۵۶) ۷۸۹-۰۱۲۳",
        department: "مدیریت حساب",
        location: "سان فرانسیسکو، ایالات متحده",
        joinedDate: "۱۰ ژوئیه ۲۰۱۲",
        manager: "مایکل براون",
        addressLine1: "خیابان پاین ۵۶۷",
        addressLine2: "واحد ۲۰۰",
        isActive: false,
      },
      {
        id: "efg",
        name: "برد پیت",
        position: "تحلیل‌گر داده",
        email: "brad.pitt@left4code.com",
        phone: "+۱ (۵۶۷) ۸۹۰-۱۲۳۴",
        department: "تجزیه و تحلیل داده",
        location: "سیاتل، ایالات متحده",
        joinedDate: "۳ سپتامبر ۲۰۱۶",
        manager: "سارا ویلسون",
        addressLine1: "خیابان سدر 890",
        addressLine2: "واحد 501",
        isActive: true,
      },
      {
        id: "fgh",
        name: "جنیفر لارنس",
        position: "مدیر مشتری",
        email: "jennifer.lawrence@left4code.com",
        phone: "+۱ (۶۷۸) ۹۰۱-۲۳۴۵",
        department: "تیم مدیریت ارتباط با مشتری",
        location: "میامی، ایالات متحده",
        joinedDate: "۱۸ فوریه ۲۰۱۹",
        manager: "دیوید میلر",
        addressLine1: "خیابان Birch 234",
        addressLine2: "آپارتمان 301",
        isActive: false,
      },
      {
        id: "ghi",
        name: "جانی دپ",
        position: "مدیر محصول",
        email: "johnny.depp@left4code.com",
        phone: "+۱ (۷۸۹) ۰۱۲-۳۴۵۶",
        department: "مدیریت محصول",
        location: "دنور، ایالات متحده",
        joinedDate: "۷ اکتبر ۲۰۱۳",
        manager: "لیندا وایت",
        addressLine1: "خیابان ویلو 345",
        addressLine2: "سوئیت 401",
        isActive: true,
      },
      {
        id: "hij",
        name: "کیت بلانچت",
        position: "مدیر پروژه",
        email: "cate.blanchett@left4code.com",
        phone: "+1 (890) 123-4567",
        department: "مدیریت پروژه",
        location: "هیوستون، ایالات متحده",
        joinedDate: "۱۲ ژوئن ۲۰۱۷",
        manager: "رابرت گرین",
        addressLine1: "خیابان میپل ۶۷۸",
        addressLine2: "طبقه ۲A",
        isActive: false,
      },
      {
        id: "ijk",
        name: "دنزل واشنگتن",
        position: "مدیر منابع انسانی",
        email: "denzel.washington@left4code.com",
        phone: "+1 (901) 234-5678",
        department: "منابع انسانی",
        location: "آتلانتا، ایالات متحده",
        joinedDate: "25 آوریل 2011",
        manager: "سوزان تیلور",
        addressLine1: "خیابان پاین 901",
        addressLine2: "طبقه 4C",
        isActive: true,
      },
      {
        id: "jkl",
        name: "جولیا رابرتز",
        position: "مهندس نرم‌افزار",
        email: "julia.roberts@left4code.com",
        phone: "+۱ (۲۳۴) ۵۶۷-۸۹۰۱",
        department: "مهندسی",
        location: "آستین، آمریکا",
        joinedDate: "۹ اوت ۲۰۱۴",
        manager: "مایکل اسکات",
        addressLine1: "خیابان بلوطی 123",
        addressLine2: "واحد 601",
        isActive: false,
      },
    ];

    return _.shuffle(users);
  },
};

export default fakers;
