import { useParams } from "react-router-dom";
import { products } from "../data/product";
import { motion } from "framer-motion";

function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  return (
    <div className="p-8">
      <motion.div layoutId={`product-${product.id}`}>
        <img src={product.image} alt={product.name} className="w-96" />
        <h2 className="text-3xl mt-4">{product.name}</h2>
        <p className="mt-2">{product.description}</p>
      </motion.div>
    </div>
  );
}

export default ProductDetail;
