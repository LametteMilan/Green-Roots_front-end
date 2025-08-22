import { NavLink } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Header from '../HeaderAll/Header/Header';
import './ProductsList.css';
import type IProducts from '../../@types/products';
import ModalEdit from '../ModalEdit/ModalEdit';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface ProductsProps {
  allProducts: IProducts[];
  setAllProducts: React.Dispatch<React.SetStateAction<IProducts[]>>;
}

function ProductsList({ allProducts, setAllProducts }: ProductsProps) {
  const base_url = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem('token');

  const [showAllProducts, setShowAllProducts] = useState(false);

  // state pour la modale d'édition
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProducts | null>(null);

  // state pour la modale de suppression
  const [showdeleteModal, setShowdeleteModal] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  // Récupère les 4 derniers produits
  const lastFourProducts = showAllProducts
    ? allProducts
    : allProducts.slice(-4);

  // fonction pour ouvrir la modale d'édition
  const handleEdit = (product: IProducts) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // fonction pour fermer la modale d'édition
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // fonctio, pour fermer la modale Delete
  const closeModal = () => {
    setShowdeleteModal(false);
  };

  // fonction pour enregistrer les modifications d'un produit
  const handleSave = async (
    id: number,
    updatedData: {
      product_name: string;
      image_product: string | File;
      product_price: number;
      product_localisation: string;
      product_description: string;
    },
  ) => {
    console.log(updatedData);
    const nonModifiedProduct = allProducts.find(
      (product) => product.id_product === id,
    );
    console.log('ancien produit', nonModifiedProduct);

    try {
      const formData = new FormData();
      formData.append(
        'product_name',
        updatedData.product_name !== undefined
          ? updatedData.product_name
          : nonModifiedProduct!.product_name,
      );
      formData.append(
        'product_price',
        updatedData.product_price !== undefined
          ? updatedData.product_price.toString()
          : nonModifiedProduct!.product_price.toString(),
      );
      formData.append(
        'product_description',
        updatedData.product_description !== undefined
          ? updatedData.product_description
          : nonModifiedProduct!.product_description,
      );
      formData.append(
        'product_localisation',
        updatedData.product_localisation !== undefined
          ? updatedData.product_localisation
          : nonModifiedProduct!.product_localisation,
      );

      if (updatedData.image_product instanceof File) {
        formData.append('image_product', updatedData.image_product);
      }

      const response = await axios.put(`${base_url}/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedProduct = response.data;
      console.log(updatedProduct);

      // Mettre à jour le state avec le produit modifié
      setAllProducts((prev) =>
        prev.map((product) =>
          product.id_product === id ? updatedProduct : product,
        ),
      );

      setIsModalOpen(false); // Ferme la modale
    } catch (error) {
      console.error('Erreur lors de la modification du produit', error);
      alert('Une erreur est survenue lors de la modification du produit.');
    }
  };

  // envoi requête poru supprimer un produit selectionné
  useEffect(() => {
    console.log('le delete confirm :', deleteConfirmed);

    // fonction pour supprimer un produit
    const handleDelete = async (id: number) => {
      if (!deleteConfirmed) return;

      try {
        const response = await axios.delete(`${base_url}/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 200) {
          const updatedProducts = allProducts.filter(
            (product) => product.id_product !== id,
          );
          console.log('nouveau tableau de produits', updatedProducts);

          setAllProducts(updatedProducts);
        } else {
          throw new Error('Erreur lors de la suppression du produit');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du produit', error);
        alert('Une erreur est survenue lors de la suppression du produit.');
      }
    };

    if (selectedProduct !== null) {
      handleDelete(selectedProduct.id_product);
      closeModal();
    }
  }, [deleteConfirmed]);

  return (
    <div>
      <Header />
      <hgroup className="hgroup-productList">
        <h2>Administration</h2>
        <p>Gestion des commandes et des produits en toute simplicité</p>
      </hgroup>

      <div className="container-productList">
        <section className="dashboard__panel">
          <button type="button">
            <NavLink to="/dashboard">Commandes</NavLink>
          </button>
          <button type="button">
            <NavLink to="/dashboard/products">Produits</NavLink>
          </button>
          <button type="button">
            <NavLink to="/dashboard/addProducts">Ajouter produit</NavLink>
          </button>
        </section>

        <section className="dashboard__products">
          <h3>Liste des produits</h3>
          {lastFourProducts.map((product) => (
            <article key={product.id_product}>
              <img
                className="product__img"
                src={`${import.meta.env.VITE_BASE_URL}/public/${product.image_product}`}
                alt={product.product_name}
              />
              <h4>{product.product_name}</h4>
              <button
                className="edit-button__container"
                type="button"
                onClick={() => handleEdit(product)}
              >
                <img
                  className="edit__button"
                  src="/assets/edit-button.png"
                  alt="edit"
                />
              </button>
              <button
                className="delete-button__container"
                type="button"
                onClick={() => {
                  setShowdeleteModal(true);
                  setSelectedProduct(product);
                }}
              >
                <img
                  className="delete__button"
                  src="/assets/trash-can.png"
                  alt="delete"
                />
              </button>
            </article>
          ))}

          <button
            className="displayAll"
            type="button"
            onClick={() => setShowAllProducts(!showAllProducts)}
          >
            {showAllProducts
              ? 'Afficher moins'
              : 'Voir tous les produits en vente'}
          </button>
        </section>
      </div>
      {/* Affichage de la modale d'édition */}
      {selectedProduct && (
        <ModalEdit
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          product={selectedProduct}
          onEdit={handleSave}
        />
      )}

      {/*Affichage modal Delete */}
      {showdeleteModal && (
        <div className="modal-form-account">
          <div className="modal-form-account-content">
            <p>Êtes-vous sûr de vouloir supprimer ce produit ?</p>

            <div className="control">
              <button
                className="button-cancel-form"
                type="button"
                onClick={closeModal}
              >
                Annuler
              </button>
              <button
                className="button-validate"
                type="button"
                onClick={() => setDeleteConfirmed(true)}
              >
                Supprimer {selectedProduct?.product_name}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default ProductsList;
