export interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  image: string;
  description: string;
}

export const products: Product[] = [
  {
    id: 1,
    title: "Vợt Cầu Lông Yonex Astrox 99",
    category: "Cầu Lông",
    price: 150.0,
    image: "https://i.pinimg.com/236x/fa/dd/e6/fadde6335ee6cf3f0ec709b34f7229d7.jpg",
    description: "Vợt cầu lông cao cấp với thiết kế mạnh mẽ, phù hợp cho người chơi tấn công.",
  },
  {
    id: 2,
    title: "Quả Cầu Lông Yonex Mavis 350",
    category: "Cầu Lông",
    price: 20.0,
    image: "https://i.pinimg.com/474x/17/cf/01/17cf01a0e9e2875727fee58c72e390e8.jpg",
    description: "Quả cầu lông chất lượng cao, độ bền tốt, phù hợp cho tập luyện và thi đấu.",
  },
  {
    id: 3,
    title: "Giày Cầu Lông Yonex SHB 65Z3",
    category: "Cầu Lông",
    price: 120.0,
    image: "https://i.pinimg.com/236x/d3/de/30/d3de301ad3d14a8060e9084eca2a79c0.jpg",
    description: "Giày cầu lông với độ bám tốt, hỗ trợ di chuyển linh hoạt.",
  },
  {
    id: 4,
    title: "Vợt Bóng Bàn Butterfly Timo Boll ALC",
    category: "Bóng Bàn",
    price: 180.0,
    image: "https://i.pinimg.com/474x/5e/fd/8c/5efd8c636ab5244aba7a1ebd288f5fed.jpg",
    description: "Vợt bóng bàn chuyên nghiệp, phù hợp cho người chơi tấn công.",
  },
  {
    id: 5,
    title: "Bàn Bóng Bàn DHS T1223",
    category: "Bóng Bàn",
    price: 300.0,
    image: "https://i.pinimg.com/236x/27/35/85/27358552b94b9533d691ab8dd204f2c9.jpg",
    description: "Bàn bóng bàn chất lượng cao, đạt tiêu chuẩn thi đấu quốc tế.",
  },
  {
    id: 6,
    title: "Bóng Bàn DHS 3 Sao",
    category: "Bóng Bàn",
    price: 15.0,
    image: "https://i.pinimg.com/236x/1c/6f/58/1c6f58ab51671669d44c19f919034a70.jpg",
    description: "Bóng bàn 3 sao, độ nảy tốt, phù hợp cho thi đấu.",
  },
];