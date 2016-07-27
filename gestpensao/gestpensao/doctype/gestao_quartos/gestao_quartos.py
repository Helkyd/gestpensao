# -*- coding: utf-8 -*-
# Copyright (c) 2015, Helio de Jesus and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document
from frappe.model.naming import make_autoname

class GESTAO_QUARTOS(Document):

	def autoname(self):
		self.name = make_autoname(self.numero_quarto + '-' + '.#####')
		self.nome_empresa= frappe.db.get_value("Empresa",None,"nome_empresa")

	def validate(self):
		self.Validar_Numero_Dias()


	def Validar_Numero_Dias(self):
		if self.horas <= 0:
			frappe.throw(_("Horas tem que ser 1 ou mais."))

		elif self.hora_entrada == self.hora_saida:
			frappe.throw(_("Hora de Saida tem que sair diferente que Hora de Entrada."))


	def on_update(self):
		self.Quartos_Status()


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

@frappe.whitelist()
def empresa_load():
	return frappe.db.get_value("Empresa",None,"moeda_default")



@frappe.whitelist()
def verifica_hora_entrada():

		print "HORA ENTRADA CCCCCCCCCCCCCCCCCCCCCCCCCCCCCC"
		# loop no Doc a procura de quartos com limite da DATA de ENTRADA.

		for d in frappe.db.sql("""SELECT numero_quarto,hora_entrada,hora_saida,status_reserva FROM `tabGESTAO_QUARTOS` WHERE status_reserva = "Ocupado" and check_in <=%s """, frappe.utils.now(), as_dict=True):
			#print("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
			if (frappe.utils.data.time_diff_in_hours(frappe.utils.now(),d.check_in) > 1):
				reser = frappe.get_doc("RESERVAS",d.codigo)
				dd= str(frappe.utils.data.time_diff_in_hours(frappe.utils.now(),d.hora_entrada))
				reser._comments = "Reserva Cancelada por mais de " + dd + " horas"
				print " AGORA " + frappe.utils.now()
				print " CHECK IN " + str(d.hora_entrada)
				print "Reserva " + d.codigo + " " + str(d.hora_entrada) + " Cancelada por mais de " + dd + " horas"
				#reser.save()

