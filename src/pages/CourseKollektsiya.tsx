import { Helmet } from "react-helmet-async";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import KollektsiyaPage from "./course-kollektsiya/KollektsiyaPage";

export default function CourseKollektsiya() {
  return (
    <>
      <Helmet>
        <title>Коллекция курсов массажа — всё в одном</title>
        <meta name="description" content="Все онлайн-курсы школы Brossok в одном комплекте. Экономия до 70% при покупке коллекции." />
      </Helmet>
      <DokNavbar />
      <KollektsiyaPage />
      <DokFooter />
    </>
  );
}
