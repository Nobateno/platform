import _ from "lodash";

export interface Department {
  id: number;
  name: string;

  head: string;
  employees: number;
  budget: string;
}

const fakers = {
  fakeDepartments() {
    const departments: Array<Department> = [
      {
        id: 1,
        name: "فروش",
        head: "جان دو",
        employees: 35,
        budget: "$2,500,000",
      },
      {
        id: 2,
        name: "بازاریابی",
        head: "جین اسمیت",
        employees: 42,
        budget: "$1,800,000",
      },
      {
        id: 3,
        name: "پشتیبانی مشتری",
        head: "دیوید جانسون",
        employees: 28,
        budget: "$1,200,000",
      },
      {
        id: 4,
        name: "مالی",
        head: "سارا ویلیامز",
        employees: 19,
        budget: "$3,000,000",
      },
      {
        id: 5,
        name: "منابع انسانی",
        head: "مایکل براون",
        employees: 14,
        budget: "$900,000",
      },
      {
        id: 6,
        name: "مهندسی",
        head: "امیلی دیویس",
        employees: 56,
        budget: "$4,500,000",
      },
      {
        id: 7,
        name: "مدیریت محصول",
        head: "دنیل لی",
        employees: 23,
        budget: "$2,200,000",
      },
      {
        id: 8,
        name: "عملیات",
        head: "الیویا ویلسون",
        employees: 31,
        budget: "$1,600,000",
      },
      {
        id: 9,
        name: "تحقیق و توسعه",
        head: "متیو تیلور",
        employees: 47,
        budget: "$3,800,000",
      },
      {
        id: 10,
        name: "ضمانت کیفیت",
        head: "صوفیا آندرسون",
        employees: 25,
        budget: "$1,300,000",
      },
    ];

    return _.shuffle(departments);
  },
};

export default fakers;
