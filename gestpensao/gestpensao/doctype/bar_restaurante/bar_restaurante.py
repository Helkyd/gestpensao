# -*- coding: utf-8 -*-
# Copyright (c) 2015, Helio de Jesus and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document
from frappe.model.naming import make_autoname

class BAR_RESTAURANTE(Document):

	def autoname(self):
		self.name = make_autoname(self.nome_mesa + '-' + '.#####')
		self.nome_empresa= frappe.db.get_value("Empresa",None,"nome_empresa")

	def validate(self):

		if (self.pagamento_por == "Conta-Corrente"):
			if (self.conta_corrente =="") or (self.conta_corrente == "nome do cliente"):
				frappe.throw(_("Cliente Conta-Corrente nao selecionado !!!! A MESA mantem-se aberta."))



	def on_update(self):
		self.Mesas_Status()
		self.Clientes_Status()


	def Mesas_Status(self):

		# Change Mesas status 
		mesa = frappe.get_doc("MESAS", self.nome_mesa)
		
		if self.status_atendimento == "Ocupado":
			mesa.status_mesa = "Ocupada"
	
		elif self.status_atendimento == "Livre":
			mesa.status_mesa = "Livre"
		elif self.status_atendimento == "Fechado":
			mesa.status_mesa = "Livre"

		mesa.save()		

	def Clientes_Status(self):
		#Update Cliente caso Conta-Corrente

		if (self.conta_corrente !="nome do cliente") and (self.conta_corrente !=None):
			cliente = frappe.get_doc("CLIENTES", self.conta_corrente)	
			if (self.status_atendimento == "Fechado") and (self.conta_corrente != "nome do cliente") :
				cliente.conta_corrente = "Conta-Corrente"
				cliente.save()		


@frappe.whitelist()
def empresa_load():
	return frappe.db.get_value("Empresa",None,"moeda_default")

@frappe.whitelist()
def empresa_load1():
	return frappe.db.get_value("COMP","moeda_default")

@frappe.whitelist()
def lista_clientes():

	return frappe.db.sql("""select name from `tabCLIENTES` WHERE cliente_tipo ='Membro' """, as_dict=False)

frappe.whitelist()
def check_caixa_aberto():

	return frappe.db.sql("""select name from `tabCAIXA_Registadora` WHERE status_caixa ='Aberto' """, as_dict=False)

