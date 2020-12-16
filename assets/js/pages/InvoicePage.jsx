import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import CustomersAPI from "../services/customersAPI";
import InvoicesAPI from "../services/invoicesAPI";

const InvoicePage = ({ match, history }) => {
  const { id = "new" } = match.params;

  const [invoice, setInvoice] = useState({
    amount: "",
    customer: "",
    status: "SENT",
  });

  const [customers, setCustomers] = useState([]);

  const [errors, setErrors] = useState({
    amount: "",
    customer: "",
    status: "",
  });

  const [editing, setEditing] = useState(false);

  // recuperation des clients depuis l'API
  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);

      if (!invoice.customer) {
        setInvoice({ ...invoice, customer: data[0].id });
      }
    } catch (error) {
      console.log(error.response);
      // TODO notification erreur
      history.replace("/invoices");
    }
  };

  // récupération de la facture en fonction de l'ID
  const fetchInvoice = async (id) => {
    try {
      const data = await InvoicesAPI.find(id);
      setInvoice({ ...data, customer: data.customer.id });
    } catch (error) {
      console.log(error.response);
      // TODO notification erreur
      history.replace("/invoices");
    }
  };

  // recuperation de la liste des client à chaque chargement  du composant
  useEffect(() => {
    fetchCustomers();
    if (id !== "new") {
      setEditing(true);
      fetchInvoice(id);
    }
  }, []);

  // gestion des changements des inputs des formulaires
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };

  // gestion de la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editing) {
        await InvoicesAPI.update(id, invoice);
        // TODO flash notification succès
      } else {
        await InvoicesAPI.create(invoice);
        // TODO flash notification succès
        history.replace("/invoices");
      }
    } catch ({ response }) {
      const { violations } = response.data;

      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);

        // TODO notification erreur
      }
    }
  };

  return (
    <>
      {(!editing && <h1>Création d'une facture</h1>) || (
        <h1>Modification d'une facture</h1>
      )}

      <form onSubmit={handleSubmit}>
        <Field
          name="amount"
          type="number"
          placeholder="Montant de la facture"
          label="Montant"
          onChange={handleChange}
          value={invoice.amount}
          error={errors.amount}
        />
        <Select
          name="customer"
          label="Client"
          value={invoice.customer}
          error={errors.customer}
          onChange={handleChange}
        >
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.firstName} {customer.lastName}
            </option>
          ))}
        </Select>

        <Select
          name="status"
          label="Statut"
          value={invoice.status}
          error={errors.status}
          onChange={handleChange}
        >
          <option value="SENT">Envoyée</option>
          <option value="PAID">Payée</option>
          <option value="CANCELLED">Annulée</option>
        </Select>

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/invoices" className="btn btn-link">
            Retour aux factures
          </Link>
        </div>
      </form>
    </>
  );
};

export default InvoicePage;