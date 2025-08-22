import { NavLink } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Header from '../HeaderAll/Header/Header';
import './AddProduct.css';
import type IProducts from '../../@types/products';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface ProductsProps {
  allProducts: IProducts[];
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAllProducts: React.Dispatch<React.SetStateAction<IProducts[]>>;
}

function AddProduct({
  allProducts,
  errorMessage,
  setErrorMessage,
  setIsLoading,
  setAllProducts,
}: ProductsProps) {
  const base_url = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem('token');

  const [showModal, setShowModal] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);
  const [oneProduct, setOneProduct] = useState<IProducts | null>(null);
  console.log('un produit:', oneProduct);

  //update du produit
  useEffect(() => {
    const addOneProduct = async (addProd: IProducts) => {
      console.log('dans le useEffect', addProd);

      if (!addProd) return; // Vérifiez si addProd est défini

      try {
        const formData = new FormData();
        formData.append('product_name', addProd.product_name);
        formData.append('product_description', addProd.product_description);
        formData.append('product_price', addProd.product_price.toString());
        formData.append('product_localisation', addProd.product_localisation);
        formData.append('image', addProd.image_product); // ← Fichier File ici (et non image_product)

        const response = await axios.post(`${base_url}/products`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        const newTab = [...allProducts, response.data];
        setAllProducts(newTab);
        setErrorMessage(`Produit ${response.data.product_name} bien ajouté`);
        setSuccessMessage(true);
      } catch (e) {
        // si y'a une erreur on l'enregistre dans le state
        setErrorMessage('Erreur de fetch du nouveau Produit');
        setSuccessMessage(false);
        console.log(e);
      }
      // on passe l'etat à false pour cacher le loader !
      setIsLoading(false);
      setShowModal(true);
    };

    if (oneProduct !== null) {
      addOneProduct(oneProduct);
    }
  }, [oneProduct]);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <Header />
      <hgroup className="hgroup-addproduct">
        <h2>Administration</h2>
        <p>Gestion des commandes et des produits en toute simplicité</p>
      </hgroup>

      <div className="container-addProduct">
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

        <section className="dashboard__add-product">
          <h3>Ajouter un produit</h3>
          <form
            action={(formData) => {
              // on créé un tableau d'ids
              const idsTab = allProducts.map((prod) => prod.id_product);
              // on prend le plus grand avec math.max
              const biggestId = Math.max(...idsTab);

              const newProduct: IProducts = {
                id_product: biggestId + 1,
                product_name: formData.get('name') as string,
                product_description: formData.get('description') as string,
                product_price: Number(formData.get('price')),
                product_localisation: formData.get('localisation') as string,
                image_product: formData.get('image') as File,
              };

              setOneProduct(newProduct);
            }}
          >
            <label htmlFor="name">Nom du produit : </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Nom du produit"
              required
            />

            <label htmlFor="localisation">Localisation : </label>
            <input
              type="text"
              id="localisation"
              name="localisation"
              placeholder="Localisation"
              required
            />

            <label htmlFor="description">Description : </label>
            <textarea
              id="description"
              name="description"
              placeholder="Description"
              required
              defaultValue="Entrez une description ici..."
            />

            <label htmlFor="image">Image : </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              required
            />

            <label htmlFor="price">Prix : </label>
            <input
              type="number"
              id="price"
              name="price"
              placeholder="Prix"
              required
            />

            <button type="submit">Ajouter le produit</button>
          </form>
        </section>
      </div>

      {showModal && (
        <div className="modal-message">
          <div className="modal-message-content">
            <button type="button" className="close-button" onClick={closeModal}>
              x
            </button>
            {successMessage ? (
              <>
                <img
                  className="success-icon"
                  src="https://upload.wikimedia.org/wikipedia/commons/f/f6/OOjs_UI_icon_check-constructive.svg"
                  alt=""
                />
                <strong className="succesful">Importation réussie</strong>
                <p className="success-message">{errorMessage}</p>
                <button
                  type="button"
                  className="button-continue"
                  onClick={()=>{
                    closeModal();
                    setErrorMessage('');
                  }
                  }
                >
                  Continuer
                </button>
              </>
            ) : (
              <>
                <img
                  className="error-icon"
                  src="../src/assets/erreur.png"
                  alt=""
                />
                <strong className="error">Oopss ... </strong>
                <p className="error-message">{errorMessage}</p>
                <button
                  type="button"
                  className="button-retry"
                  onClick={closeModal}
                >
                  Réessayer plus tard ...
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default AddProduct;
