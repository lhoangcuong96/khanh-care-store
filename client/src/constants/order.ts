export const locations = [
  {
    label: "Đồng Nai",
    key: "dong-nai",
    districts: [
      {
        label: "Biên Hòa",
        key: "bien-hoa",
        wards: [
          {
            label: "An Bình",
            key: "an-binh",
          },
          {
            label: "An Hòa",
            key: "an-hoa",
          },
          {
            label: "Bình Đa",
            key: "binh-da",
          },
          {
            label: "Bửu Hoà",
            key: "buu-hoa",
          },
          {
            label: "Bửu Long",
            key: "buu-long",
          },
          {
            label: "Hiệp Hoà",
            key: "hiep-hoa",
          },
          {
            label: "Hoá An",
            key: "hoa-an",
          },
          {
            label: "Hố Nai",
            key: "ho-nai",
          },
          {
            label: "Long Bình",
            key: "long-binh",
          },
          {
            label: "Long Bình Tân",
            key: "long-binh-tan",
          },
          {
            label: "Phước Tân",
            key: "phuoc-tan",
          },
          {
            label: "Quang Vinh",
            key: "quang-vinh",
          },
          {
            label: "Tam Hiệp",
            key: "tam-hiep",
          },
          {
            label: "Tam Phước",
            key: "tam-phuoc",
          },
          {
            label: "Tân Biên",
            key: "tan-bien",
          },
          {
            label: "Tân Hạnh",
            key: "tan-hanh",
          },
          {
            label: "Tân Hoà",
            key: "tan-hoa",
          },
          {
            label: "Tân Hiệp",
            key: "tan-hiep",
          },
          {
            label: "Tân Mai",
            key: "tan-mai",
          },
          {
            label: "Tân Phong",
            key: "tan-phong",
          },
          {
            label: "Tân Vạn",
            key: "tan-van",
          },
          {
            label: "Thống Nhất",
            key: "thong-nhat",
          },
          {
            label: "Trảng Dài",
            key: "trang-dai",
          },
          {
            label: "Trung Dũng",
            key: "trung-dung",
          },
          {
            label: "Long Hưng",
            key: "long-hung",
          },
        ],
      },
    ],
  },
];

export enum Period {
  MORNING = "morning",
  AFTERNOON = "afternoon",
  EVENING = "evening",
}

export const periodOptions = [
  { label: "Sáng", value: Period.MORNING },
  { label: "Chiều", value: Period.AFTERNOON },
  { label: "Tối", value: Period.EVENING },
];

export const orderStatusEnum = {
  PENDING: "Đang chờ xử lý",
  PROCESSING: "Đang xử lý",
  DELIVERING: "Đang giao hàng",
  DELIVERED: "Đang giao hàng",
  CANCELLED: "Đã hủy",
  COMPLETED: "Đã hoàn thành",
};
