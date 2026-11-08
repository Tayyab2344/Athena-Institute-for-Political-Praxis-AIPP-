export type HomeStory = {
  number: string;
  label: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  linkText: string;
  linkHref: string;
};

export const HOME_STORY: HomeStory[] = [
  {
    number: "01",
    label: "Research",
    title: "See the system before you try to change it.",
    description: "AIPP turns complex diplomatic patterns into clear evidence, helping institutions understand where representation, access, and influence are being lost.",
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=85&w=1400",
    imageAlt: "Research books and notes arranged on a library table",
    linkText: "Explore research",
    linkHref: "#research",
  },
  {
    number: "02",
    label: "Strategy",
    title: "Practice the decisions before the room gets difficult.",
    description: "Through simulations, negotiation labs, and executive workshops, women leaders build the confidence and tactical fluency to move high-stakes conversations forward.",
    image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=85&w=1400",
    imageAlt: "Women collaborating around a table during a workshop",
    linkText: "See strategic programs",
    linkHref: "#programs",
  },
  {
    number: "03",
    label: "Advocacy",
    title: "Carry better ideas into the public conversation.",
    description: "We connect rigorous policy thinking with the forums, media, and coalitions that can turn a good recommendation into institutional momentum.",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=85&w=1400",
    imageAlt: "An international policy gathering in a bright conference room",
    linkText: "Read the latest insights",
    linkHref: "#insights",
  },
];
