# -*- coding: utf-8 -*-
# Copyright (c) 2015, Helio de Jesus and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class QUARTOS(Document):

	def autoname(self):
		
		self.name = self.numero + "-" + self.nome_quarto
		self.nome_empresa= frappe.db.get_value("Empresa",None,"nome_empresa")

@frappe.whitelist()
def empresa_load():
	return frappe.db.get_value("Empresa",None,"moeda_default")

