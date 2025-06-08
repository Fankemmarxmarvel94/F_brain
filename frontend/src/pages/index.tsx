// import Categories from '../components/home/Categories';
// import Footer from '../components/common/Footer'
import Header from '../components/common/Header';
// import Hero from '../components/home/Hero';
// import InfoSection from '../components/home/InfoSection';
// import PopularCars from '../components/home/PopularCars';
// import Testimonials from '../components/home/Testimonials';

export default function IndexPage() {
  return (
    <div>
      <div>
        <Header />
        {/* <Hero /> */}
        <div className='w-full flex justify-center'>
          {/* <Categories /> */}
        </div>
        <div className='w-full flex justify-center'>
          {/* <PopularCars /> */}
        </div>
        <div className='w-full flex justify-center'>
          {/* <Testimonials /> */}
        </div>
        <div className='w-full flex justify-center'>
          {/* <InfoSection /> */}
        </div>
      </div>
      <div className='w-full flex justify-center'>
        {/* <Footer /> */}
      </div>
    </div>
  )
}