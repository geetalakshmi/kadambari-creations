/*export default function Hero() {
  return (
    <section className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-16 grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
            Festive Fashion, Handpicked for You
          </h1>
          <p className="mt-3 text-gray-600">
            Discover sarees, kurtis, lehengas, and more—crafted with care. New arrivals every week.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#" className="btn bg-rose-600 text-white">Shop Women</a>
            <a href="#" className="btn bg-gray-900 text-white">Shop Men</a>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-sm">
          <img src="https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=1200&q=80" alt="Fashion"  />
        </div>
      </div>
    </section>
  )
}
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const images = [
  "/images/hero1.jpg",
  "/images/hero2.jpg",
  "/images/hero3.jpg"
]

export default function Hero() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000
  }

  return (
    <section className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-16 grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
            Festive Fashion, Handpicked for You
          </h1>
          <p className="mt-3 text-gray-600">
            Discover sarees, kurtis, lehengas, and more—crafted with care. New arrivals every week.
          </p>
      </div>
      
        <Slider {...settings}>
          {images.map((src, i) => (
            <div key={i} className="rounded-2xl overflow-hidden shadow-sm">
              <img
                src={src}
                alt={`Slide ${i + 1}`}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          ))}
        </Slider>

      </div>
    </section>
  )
}

*/

// frontend/src/components/Hero.tsx
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import hero1 from "../images/hero1.jpg"
import hero2 from "../images/hero2.jpg"
import hero3 from "../images/hero3.jpg"

// Auto-import every image in src/assets/hero with these extensions
const imported = import.meta.glob("../images/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  import: "default",
}) as Record<string, string>

// Sort by filename for stable order
const images = Object.entries(imported)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, url]) => url)

export default function Hero() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  }

  // Optional fallback if no images found
//const list = images.length ? images : ["/placeholder-hero.jpg"]

const list = [hero1, hero2, hero3]

  return (
    <section className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-16 grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
            Festive Fashion, Handpicked for You
          </h1>
          <p className="mt-3 text-gray-600">
            Discover sarees, kurtis, lehengas, and more—crafted with care. New arrivals every week.
          </p>
        </div>

        <Slider {...settings}>
          {list.map((src, i) => (
            <div key={i} className="rounded-2xl overflow-hidden shadow-sm">
              <img
                src={src}
                alt={`Slide ${i + 1}`}
                className="w-full h-64 md:h-96 object-cover"
                loading="eager"
              />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  )
}
