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
    const { id: owner } = req.user;
    const contact = await listContacts({ owner });

    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: owner } = req.user;
    const contact = await getContactById(id, owner);
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
    const { id: owner } = req.user;
    const { name, email, phone } = req.body;
    const newContact = await addContact({ ...req.body, owner });
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: owner } = req.user;
    const data = await updateContact({ id, owner }, req.body);

    if (!DataTransferItem) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: owner } = req.user;
    const { favorite } = req.body;
    const data = await updateContact({ id, owner, favorite });
    if (!data) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const { id: owner } = req.user;
  try {
    const data = await removeContact({ id, owner });
    if (!data) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json({
      message: "Delete successfully",
    });
  } catch (error) {
    next(error);
  }
};
