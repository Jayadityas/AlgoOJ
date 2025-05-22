import { motion } from "framer-motion";
import ss2 from "../assets/ss2.png"; // Replace with your own image
import {useNavigate} from 'react-router-dom'

export default function Hero() {
  const navigate = useNavigate()
  return (
    <section className="w-full dark:bg-gray-950 py-30 px-4 bg-[#07034d]">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        {/* Left: Text Content */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-amber-300 dark:text-white">
            Master Competitive Coding on <span className="text-purple-400">THE OJ</span>
          </h1>
          <p className="mt-4 text-lg text-white dark:text-gray-300">
            A modern online judge platform for problem-solving, contests, and learning — fast and reliable.
          </p>

          <div className="mt-8 flex gap-4 flex-wrap">
            <button className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold text-lg hover:shadow-lg transition relative border-transparent hover:border-white animate-borderMove">
              Get Started
            </button>
            <button onClick={()=>navigate('/problems')} className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold text-lg hover:shadow-lg transition relative border-transparent hover:border-white animate-borderMove">
              View Problems
            </button>
          </div>
        </motion.div>

        {/* Right: Image */}
        <motion.div
          className="flex-1 flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={ss2}
            alt="Hero Illustration"
            className="w-full max-w-md"
          />
        </motion.div>
      </div>
    </section>
  );
}
