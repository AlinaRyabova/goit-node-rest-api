import fs from "fs/promises";
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
    const { name, email, phone, favorite } = req.body;

    const { id: owner } = req.user;

    const newContact = await addContact({
      name,
      email,
      phone,
      favorite,
      owner,
    });
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: owner } = req.user;
    const contact = await updateContact(id, owner, req.body);

    if (!contact) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: owner } = req.user;
    const { favorite } = req.body;

    if (typeof favorite !== "boolean") {
      throw HttpError(400, "Missing field favorite");
    }

    const data = await updateContact(id, owner, { favorite });
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
    const contact = await removeContact(id, owner);
    if (!contact) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json({
      message: "Delete successfully",
      contact,
    });
  } catch (error) {
    next(error);
  }
};
