import { useEffect, useState } from "react";
import img1 from "@assets/stock_images/junk_removal_truck_s_8d89f5e0.jpg";
import img2 from "@assets/stock_images/junk_removal_truck_s_08e95c57.jpg";
import img3 from "@assets/stock_images/junk_removal_truck_s_6100f5f9.jpg";
import img4 from "@assets/stock_images/junk_removal_truck_s_20fde47d.jpg";
import img5 from "@assets/stock_images/junk_removal_truck_s_8e2ece45.jpg";
import img6 from "@assets/stock_images/junk_removal_truck_s_7e78a264.jpg";

const images = [img1, img2, img3, img4, img5, img6];

export default function ImageCarousel() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      marginBottom: '24px',
      overflow: 'hidden',
      borderRadius: '12px',
    }}>
      <div style={{
        display: 'flex',
        transition: 'transform 1s ease-in-out',
        transform: `translateX(-${offset * 25}%)`,
      }}>
        {[...images, ...images].map((img, i) => (
          <div
            key={i}
            style={{
              minWidth: '25%',
              padding: '0 4px',
            }}
          >
            <img
              src={img}
              alt="Junk removal service"
              style={{
                width: '100%',
                height: '120px',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
