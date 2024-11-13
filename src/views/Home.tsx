import Carousel from "../components/Carousel";
import Cards from "../components/Cards";
import Advertising from "../components/Advertising";
import News from "../components/News";
import Text from "../components/Text";

const Home = () => {
  return (
    <div>
      <Carousel />
      <Text />
      <Advertising />
      <News />
      <Cards />
    </div>
  );
};

export default Home;
