import {
  listContacts,
  getContactById,
  updateContact,
  removeContact,
  addContact,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contact = await listContacts();

    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (!contact) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const newContact = await addContact(name, email, phone);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContactById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedContact = await updateContact(id, req.body);

    if (!updatedContact) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;
    const updatedContact = await updateContact(id, { favorite });
    if (!updatedContact) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedContact = await removeContact(id);
    if (!deletedContact) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.status(200).json(deletedContact);
  } catch (error) {
    next(error);
  }
};
