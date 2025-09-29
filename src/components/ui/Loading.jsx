import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  if (type === "table") {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-64 skeleton"></div>
          <div className="h-8 bg-gray-200 rounded w-24 skeleton"></div>
        </div>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-surface p-4">
            <div className="grid grid-cols-6 gap-4">
              <div className="h-4 bg-gray-200 rounded skeleton"></div>
              <div className="h-4 bg-gray-200 rounded skeleton"></div>
              <div className="h-4 bg-gray-200 rounded skeleton"></div>
              <div className="h-4 bg-gray-200 rounded skeleton"></div>
              <div className="h-4 bg-gray-200 rounded skeleton"></div>
              <div className="h-4 bg-gray-200 rounded skeleton"></div>
            </div>
          </div>
          {[...Array(8)].map((_, index) => (
            <div key={index} className="p-4 border-t border-gray-200">
              <div className="grid grid-cols-6 gap-4">
                <div className="h-4 bg-gray-200 rounded skeleton"></div>
                <div className="h-4 bg-gray-200 rounded skeleton"></div>
                <div className="h-4 bg-gray-200 rounded skeleton"></div>
                <div className="h-4 bg-gray-200 rounded skeleton"></div>
                <div className="h-4 bg-gray-200 rounded skeleton"></div>
                <div className="h-4 bg-gray-200 rounded skeleton"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-card p-6 border border-gray-200"
          >
            <div className="h-6 bg-gray-200 rounded skeleton mb-4"></div>
            <div className="h-4 bg-gray-200 rounded skeleton mb-2"></div>
            <div className="h-4 bg-gray-200 rounded skeleton mb-4 w-3/4"></div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded skeleton w-1/3"></div>
              <div className="h-6 bg-gray-200 rounded skeleton w-16"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "dashboard") {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-card p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded skeleton w-20"></div>
                  <div className="h-8 bg-gray-200 rounded skeleton w-16"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-lg skeleton"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-card p-6 border border-gray-200">
            <div className="h-6 bg-gray-200 rounded skeleton mb-4 w-48"></div>
            <div className="h-64 bg-gray-200 rounded skeleton"></div>
          </div>
          <div className="bg-white rounded-lg shadow-card p-6 border border-gray-200">
            <div className="h-6 bg-gray-200 rounded skeleton mb-4 w-48"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded skeleton w-32"></div>
                  <div className="h-4 bg-gray-200 rounded skeleton w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
      />
    </div>
  );
};

export default Loading;