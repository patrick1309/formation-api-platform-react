import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Field from "../components/forms/Field";
import FormContentLoader from "../components/loaders/FormContentLoader";
import CustomersAPI from "../services/customersAPI";

const CustomerPage = ({ match, history }) => {
  const { id = "new" } = match.params;

  const [customer, setCustomer] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: "",
  });

  const [errors, setErrors] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: "",
  });

  const [editing, setEditing] = useState(false);

  const [loading, setLoading] = useState(false);

  // récupération du customer en fonction de l'ID
  const fetchCustomer = async (id) => {
    try {
      const { lastName, firstName, email, company } = await CustomersAPI.find(
        id
      );
      setCustomer({ lastName, firstName, email, company });
      setLoading(false);
    } catch (error) {
      toast.error("Le client n'a pas pu être chargé");
      history.replace("/customers");
    }
  };

  // chargement du customer au chargement du composant ou identifiant
  useEffect(() => {
    if (id !== "new") {
      setLoading(true);
      setEditing(true);
      fetchCustomer(id);
    }
  }, [id]);

  // gestion des changements des inputs des formulaires
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setCustomer({ ...customer, [name]: value });
  };

  // gestion de la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setErrors({});
      if (editing) {
        await CustomersAPI.update(id, customer);
        toast.success("Le client a bien été modifié");
      } else {
        await CustomersAPI.create(customer);
        toast.success("Le client a bien été créé");
        history.replace("/customers");
      }
    } catch ({ response }) {
      const { violations } = response.data;

      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);

        toast.error("Des erreurs dans votre formulaire");
      }
    }
  };

  return (
    <>
      {(!editing && <h1>Création d'un client</h1>) || (
        <h1>Modification du client</h1>
      )}

      {loading && <FormContentLoader />}

      {!loading && (
        <form onSubmit={handleSubmit}>
          <Field
            name="lastName"
            label="Nom de famille"
            value={customer.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
          <Field
            name="firstName"
            label="Prénom"
            value={customer.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />
          <Field
            name="email"
            label="Email"
            type="email"
            value={customer.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Field
            name="company"
            label="Entreprise"
            value={customer.company}
            onChange={handleChange}
            error={errors.company}
          />

          <div className="form-group">
            <button type="submit" className="btn btn-success">
              Enregistrer
            </button>
            <Link to="/customers" className="btn btn-link">
              Retour à la liste
            </Link>
          </div>
        </form>
      )}
    </>
  );
};

export default CustomerPage;
