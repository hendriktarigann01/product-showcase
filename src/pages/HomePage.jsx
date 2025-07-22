import { Link } from "react-router-dom";
import { products } from "../data/product";
import { motion } from "framer-motion";

function HomePage() {
  return (
    <div className="p-8">
      {products.map((product) => (
        <Link key={product.id} to={`/product/${product.id}`}>
          <motion.div
            layoutId={`product-${product.id}`}
            className="mb-4 cursor-pointer"
          >
            <img src={product.image} alt={product.name} className="w-48" />
            <h2 className="text-xl">{product.name}</h2>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}

export default HomePage;
