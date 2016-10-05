# -*- coding: utf-8 -*-
# Copyright (c) 2015, Helio de Jesus and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
<<<<<<< HEAD
<<<<<<< HEAD
from frappe import _
from frappe.model.document import Document
from frappe.model.naming import make_autoname
=======
from frappe.model.document import Document
from frappe.model.naming import make_autoname
from frappe import _
>>>>>>> Versao Production
=======
from frappe.model.document import Document
from frappe.model.naming import make_autoname
from frappe import _
>>>>>>> Versao Production

class CAIXA_Registadora(Document):

	def autoname(self):
		self.name = make_autoname(self.abertura_fecho + '-' + '.#####')
		self.nome_empresa= frappe.db.get_value("Empresa",None,"nome_empresa")
		self.usuario_caixa= frappe.session.user



<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> Versao Production
	def validate(self):
		if len(frappe.db.sql("""select name from `tabBAR_RESTAURANTE` WHERE status_atendimento ='Ocupado' """, as_dict=False)) >= 1:
			frappe.throw(_("CAIXA Aberto. Por favor fechar primeiro!!!!"))

<<<<<<< HEAD
>>>>>>> Versao Production
=======
>>>>>>> Versao Production
@frappe.whitelist()
def empresa_load():
	return frappe.db.get_value("Empresa",None,"moeda_default")

@frappe.whitelist()
def caixa_aberto():

	return frappe.db.sql("""select name from `tabCAIXA_Registadora` WHERE status_caixa ='Aberto' """, as_dict=False)

<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> Versao Production
=======
>>>>>>> Versao Production
@frappe.whitelist()
def mesas_abertas():

	return frappe.db.sql("""select name from `tabBAR_RESTAURANTE` WHERE status_atendimento ='Ocupado' """, as_dict=False)
<<<<<<< HEAD
<<<<<<< HEAD



=======
>>>>>>> Versao Production
=======
>>>>>>> Versao Production
