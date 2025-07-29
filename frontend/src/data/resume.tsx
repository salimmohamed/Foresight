import { Icons } from "@/components/icons";

export const DATA = {
  name: "Stocks Project",
  initials: "SP",
  url: "https://your-stocks-project-url.com",
  description:
    "A stock monitoring and alert application with AI-powered insights.",
  navbar: [
    {
      href: "/",
      icon: Icons.globe,
      label: "Home",
    },
    {
      href: "/dashboard",
      icon: Icons.globe,
      label: "Dashboard",
    },
    {
      href: "/alerts",
      icon: Icons.email,
      label: "Alerts",
    },
  ],
  contact: {
    social: {
      github: {
        url: "https://github.com/salimmohamed/Foresight",
        icon: Icons.globe,
        navbar: true,
      },
    },
  },
};