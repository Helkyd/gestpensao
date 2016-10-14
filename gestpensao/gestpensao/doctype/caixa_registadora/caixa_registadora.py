# -*- coding: utf-8 -*-
# Copyright (c) 2015, Helio de Jesus and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document
from frappe.model.naming import make_autoname

class CAIXA_Registadora(Document):

	def autoname(self):
		self.name = make_autoname(self.abertura_fecho + '-' + '.#####')
		self.nome_empresa= frappe.db.get_value("Empresa",None,"nome_empresa")
		self.usuario_caixa= frappe.session.user

	def validate(self):
		print "VAAAAAALIIIIIIDAR"
		d=caixa_aberto()
		if (d !=None):
			print d
			validated=False
			frappe.throw(_("CAIXA JA ESTA ABERTO!!! NAO PODE TER MAIS QUE UM ABERTO"))


@frappe.whitelist()
def empresa_load():
	return frappe.db.get_value("Empresa",None,"moeda_default")

@frappe.whitelist()
def caixa_aberto():

	if (frappe.db.sql("""select name from `tabCAIXA_Registadora` WHERE status_caixa ='Aberto' """, as_dict=False)) != ():
		print "AAAAAAAA"
		print frappe.db.sql("""select name from `tabCAIXA_Registadora` WHERE status_caixa ='Aberto' """, as_dict=False)	
		return frappe.db.sql("""select name from `tabCAIXA_Registadora` WHERE status_caixa ='Aberto' """, as_dict=False)
	elif (frappe.db.sql("""select name from `tabCAIXA_Registadora` WHERE status_caixa ='Em Curso' """, as_dict=False)) != ():
		return frappe.db.sql("""select name from `tabCAIXA_Registadora` WHERE status_caixa ='Em Curso' """, as_dict=False)
		print "BBBBBBBBB"
		print frappe.db.sql("""select name from `tabCAIXA_Registadora` WHERE status_caixa ='Aberto' """, as_dict=False)	



@frappe.whitelist()
def mesas_abertas():

	return frappe.db.sql("""select name from `tabBAR_RESTAURANTE` WHERE status_atendimento ='Ocupado' """, as_dict=False)


@frappe.whitelist()
def caixa_stat():

	return frappe.get_value("CAIXA_Registadora",{'status_caixa':'Em Curso'},'status_caixa')


