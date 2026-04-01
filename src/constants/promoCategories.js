import catHats from "../img/picture/hat.jpg";
import catSweaters from "../img/picture/sweater.jpg";
import catToys from "../img/picture/toy.jpg";
import catAccessories from "../img/picture/scarf.jpg";

export const PROMO_CATEGORIES = [
    {
        title: "Шапки",
        subtitle: "Теплі, стильні, ручна робота",
        img: catHats,
        href: "/catalog?category=hats",
    },
    {
        title: "Светри",
        subtitle: "Затишні моделі на зиму",
        img: catSweaters,
        href: "/catalog?category=sweaters",
    },
    {
        title: "Іграшки",
        subtitle: "Подарунки для дітей і дорослих",
        img: catToys,
        href: "/catalog?category=toys",
    },
    {
        title: "Аксесуари",
        subtitle: "Шарфи, рукавички, сумки",
        img: catAccessories,
        href: "/catalog?category=accessories",
    },
];