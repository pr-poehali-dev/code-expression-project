import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import ImagePrimerkaHero from "@/pages/image-primerka/ImagePrimerkaHero";
import ImagePrimerkaProblem from "@/pages/image-primerka/ImagePrimerkaProblem";
import ImagePrimerkaSolution from "@/pages/image-primerka/ImagePrimerkaSolution";
import ImagePrimerkaSocialProof from "@/pages/image-primerka/ImagePrimerkaSocialProof";

export default function ImagePrimerkaLanding() {
  return (
    <>
      <Helmet>
        <title>ИИ-примерка образа — согласуйте ожидания до услуги | Промт Диалог</title>
        <meta name="description" content="Не угадывайте, какой результат клиент назвал «красиво». Покажите направление образа до записи или до начала работы и обсудите ожидания на одном языке — ИИ-примерка для бьюти-мастеров и салонов." />
        <meta name="keywords" content="ии примерка образа, согласование ожиданий с клиентом, виртуальная примерка для салона красоты, примерка стрижки онлайн, инструменты для мастера бьюти" />
      </Helmet>

      <BizNavbar />

      <ImagePrimerkaHero />
      <ImagePrimerkaProblem />
      <ImagePrimerkaSolution />
      <ImagePrimerkaSocialProof />

      <BizFooter />
    </>
  );
}
