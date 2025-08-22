import { useState, useEffect } from 'react';
import type IProducts from '../../@types/products';
import './ModalEdit.css'; 

interface ModalEditProps {
  isOpen: boolean;
  onClose: () => void;
  product: IProducts;
  onEdit: (id: number, updatedData: {
    product_name: string;
    image_product: File | string;
    product_price: number;
    product_localisation: string;
    product_description: string;
  }) => void;
}

const ModalEdit = ({ isOpen, onClose, product, onEdit }: ModalEditProps) => {
  const [productName, setProductName] = useState(product.product_name);
  const [imageProduct, setImageProduct] = useState<File | string>(product.image_product);
  const [price, setPrice] = useState(product.product_price);
  const [location, setLocation] = useState(product.product_localisation);
  const [description, setDescription] = useState(product.product_description);

    // useEffect pour mettre à jour les champs de la modale lorsque le produit change
  useEffect(() => {
    setProductName(product.product_name);
    setImageProduct(product.image_product);
    setPrice(product.product_price);
    setLocation(product.product_localisation);
    setDescription(product.product_description);
  }, [product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        setImageProduct(e.target.files[0]);
    }
};

  const handleSave = () => {
    const updatedData = {
      product_name: productName,
      image_product: imageProduct,
      product_price: price,
      product_localisation:
      location,
      product_description: description,
    };
    onEdit(product.id_product, updatedData);
    onClose();
  };

  

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Édition du produit</h2>
        <div className="modal-inputs">

          <label htmlFor='productName'>Nom du produit</label>
          <input
            type="text"
            name="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          
          <label htmlFor='imageProduct'>Image du produit</label>
          <input
            type="file"
            name="imageProduct"
            accept='image/*'
            onChange={handleImageChange}
          />
          
          <label htmlFor='price'>Prix</label>
          <input
            type="number"
            name="price"
            value={price}
            onChange={(e) => setPrice(Number.parseFloat(e.target.value))}
          />
          
          <label htmlFor='location'>Localisation</label>
          <input
            type="text"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          
          <label htmlFor='description'>Description</label>
          <textarea
            value={description}
            name="description"
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="modal-buttons">
            <button type='button' onClick={onClose}>Annuler</button>
            <button type='button' onClick={handleSave}>Enregistrer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEdit;
