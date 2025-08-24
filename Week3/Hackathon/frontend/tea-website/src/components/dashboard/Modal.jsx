// "use client"

// const Modal = ({ children, onClose }) => {
//     return (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg shadow-xl relative max-w-md w-full mx-4">
//                 <button
//                     onClick={onClose}
//                     className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 flex items-center justify-center"
//                 >
//                     ×
//                 </button>
//                 {children}
//             </div>
//         </div>
//     )
// }

// export default Modal


"use client"

const Modal = ({ children, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-start justify-center z-50 pt-10"
      onClick={onClose} // close when clicking outside
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl relative max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()} // stop close when clicking inside
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 flex items-center justify-center"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  )
}

export default Modal
