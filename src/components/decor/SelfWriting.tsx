import { motion } from 'framer-motion';

/* the start of the line is already on the paper; the rest writes itself in,
   letter by letter, when the reader scrolls to it. By default the second
   half is written in; `tailWords` limits it to the last N words instead */
export default function SelfWriting({ text, tailWords }: { text: string; tailWords?: number }) {
  const words = text.split(' ');
  const split =
    tailWords && tailWords < words.length
      ? words.slice(0, words.length - tailWords).join(' ').length
      : Math.ceil(text.length / 2);
  const head = text.slice(0, split);
  const tail = text.slice(split);
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
      variants={{ visible: { transition: { staggerChildren: 0.035, delayChildren: 0.25 } } }}
    >
      {head}
      {tail.split('').map((char, i) => (
        <motion.span
          // eslint-disable-next-line react/no-array-index-key -- static text, order never changes
          key={i}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.04 } },
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}
