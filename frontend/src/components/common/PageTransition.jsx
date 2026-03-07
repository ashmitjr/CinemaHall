import { motion } from "framer-motion";

const variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

export const PageTransition = ({ children }) => (
  <motion.div variants={variants} initial="initial" animate="animate" exit="exit">
    {children}
  </motion.div>
);
