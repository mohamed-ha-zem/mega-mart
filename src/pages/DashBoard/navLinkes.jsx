import { faBook, faIcons, faPager, faPlus, faProcedures, faUserPlus, faUsers } from "@fortawesome/free-solid-svg-icons";

export const Linkes = [
    {
        path: "users",
        title: "Users",
        icon: faUsers,
        role: "1995"
    },
    {
        path: "users/add",
        title: "add User",
        icon: faUserPlus,
        role: "1995"
    },
    {
        path: "categories",
        title: "Categories",
        icon: faIcons,
        role: ["1995" , "1999"]
    },
    {
        path: "categories/add",
        title: "Add Category",
        icon: faPlus,
        role: ["1995" , "1999"]
    },
    {
        path: "products",
        title: "Products",
        icon: faPager,
        role: ["1995" , "1999"]
    },
    {
        path: "products/add",
        title: "Add product",
        icon: faPlus,
        role: ["1995" , "1999"]
    },
    {
        path: "users/writer",
        title: "Writer",
        icon: faBook,
        role: ["1995", "1996"]
    }
]