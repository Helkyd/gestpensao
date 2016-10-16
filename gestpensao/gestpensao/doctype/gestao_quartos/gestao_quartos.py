# -*- coding: utf-8 -*-
# Copyright (c) 2015, Helio de Jesus and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from datetime import datetime, timedelta
from frappe.utils import cstr, get_datetime, getdate, cint, get_datetime_str
from frappe.model.document import Document
from frappe.model.naming import make_autoname

form_grid_templates = {
	"items": "templates/form_grid/gestao_quartos_list.html"
}

class GESTAO_QUARTOS(Document):

	def autoname(self):
		self.name = make_autoname(self.numero_quarto + '-' + '.#####')
		self.nome_empresa= frappe.db.get_value("Empresa",None,"nome_empresa")

	def validate(self):
		self.Validar_Numero_Dias()
		self.Check_ContaCorrente()
		self.Sethoras_Quarto()

	def Validar_Numero_Dias(self):
		if self.horas <= 0:
			validated=False
			frappe.throw(_("Horas/Dias tem que ser 1 ou mais."))

		elif self.hora_entrada == self.hora_saida:
			validated=False
			frappe.throw(_("Hora de Saida tem que sair diferente que Hora de Entrada."))


	def on_update(self):
		self.Quartos_Status()
		#self.valor_pago = self.total_servicos


	def Quartos_Status(self):

		# Change Quarto status 
		quarto = frappe.get_doc("QUARTOS", self.numero_quarto)
		
		if self.status_reserva == "Ocupado":
			quarto.status_quarto = "Ocupado"
		elif self.status_reserva == "Ativo":
			quarto.status_quarto = "Ocupado"
		elif self.status_reserva == "Livre":
			quarto.status_quarto = "Livre"
		elif self.status_reserva == "Fechado":
			quarto.status_quarto = "Livre"

		quarto.save()		

	def Check_ContaCorrente(self):
		# Not yet Implemented...
		if (self.servico_pago_por=="Conta-Corrente"):
			self.nome_cliente = self.conta_corrente
			if (self.conta_corrente == "") or (self.conta_corrente == "nome do cliente"):
				validated= False
				frappe.throw(_("Nao foi selecionado o Cliente para Conta-Corrente."))

#			validated= False
#			frappe.throw(_("Modulo nao funcional de momento."))

		if (self.pagamento_por=="Conta-Corrente"):
			if (self.conta_corrente == "") or (self.conta_corrente == "nome do cliente"):
				validated= False
				frappe.throw(_("Nao foi selecionado o Cliente para Conta-Corrente."))


	def Sethoras_Quarto(self):
		
		if self.hora_diaria_noite == "Noite":			
			self.hora_saida= get_datetime(self.hora_entrada) + timedelta(hours=12)			
		elif self.hora_diaria_noite == "Diaria":
			self.hora_saida= get_datetime(self.hora_entrada) + timedelta(days=self.horas)
		elif self.hora_diaria_noite == "Hora":
			self.hora_saida = get_datetime(self.hora_entrada) + timedelta(hours=self.horas)

		print "DEPOIS DE CALCULAR"
		print self.hora_saida

@frappe.whitelist()
def empresa_load():
	return frappe.db.get_value("Empresa",None,"moeda_default")

@frappe.whitelist()
def lista_clientes():

	return frappe.db.sql("""select name from `tabCLIENTES` WHERE cliente_tipo ='Membro' """, as_dict=False)

