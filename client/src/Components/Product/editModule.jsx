import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { ImageUpload } from "./imageUpload";

export const EditModal = ({ slide, onClose, onSave }) => {
  const [name, setName] = useState(slide.name);
  const [description, setDescription] = useState(slide.description);
  const [price, setPrice] = useState(slide.price);
  const [images, setImages] = useState(slide.images || []);
  const [newImages, setNewImages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      _id: slide._id,
      name,
      price,
      description,
      updatedImages: newImages,
    });
    onClose();
  };

  const handleImageSelect = (file, index) => {
    const updatedImages = [...images];
    updatedImages[index] = file; // Replace image at the specified index
    setImages(updatedImages);

    const updatedNewImages = [...newImages];
    const existingIndex = updatedNewImages.findIndex(
      (item) => item.index === index
    );

    if (existingIndex >= 0) {
      updatedNewImages[existingIndex] = { file, index };
    } else {
      updatedNewImages.push({ file, index });
    }

    setNewImages(updatedNewImages);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 min-h-screen overflow-auto hide-scrollbar">
      <div className="bg-white dark:bg-[#111827] rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Slide</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-[#111827]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-[#111827]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-[#111827] h-[150px]"
            />
          </div>

          <ImageUpload
            onImageSelect={handleImageSelect}
            initialImages={images}
          />

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
