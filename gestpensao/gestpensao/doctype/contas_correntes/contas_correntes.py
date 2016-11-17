# -*- coding: utf-8 -*-
# Copyright (c) 2015, Helio de Jesus and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.utils import cstr, flt, getdate
from frappe.model.document import Document
from frappe.model.naming import make_autoname
import sys
reload(sys)
sys.setdefaultencoding('utf8')

class CONTAS_CORRENTES(Document):

	def autoname(self):
		self.name = self.cc_nome_cliente
		self.nome_empresa= frappe.db.get_value("Empresa",None,"nome_empresa")

@frappe.whitelist()
def ordem_idx(cliente):

	numero = 1
	for t in frappe.db.sql(""" SELECT idx,name,parent,status_conta_corrente from tabCC_detalhes where parent =%s ORDER BY status_conta_corrente ASC  """,cliente,as_dict=True):
#		print t.parent
		reset_idx = frappe.get_doc("CC_detalhes",t.name)
		print "ORDENAR IDX"
		print reset_idx.name
		print reset_idx.parent
		print reset_idx.idx
		print reset_idx.numero_registo


		reset_idx.idx = numero
		numero = numero + 1
		reset_idx.save()
		print "Numero"
		print numero

#	for i, item in enumerate(sorted(t._range, key=lambda t: t.status_conta_corrente), start=1):
#		item.idx = i


@frappe.whitelist()
def set_bar_restaurante_cc():

	for clientes in frappe.db.sql("""SELECT name, cliente_tipo from tabCLIENTES where cliente_tipo ='Membro' """,as_dict=True):
		print "Cliente ", clientes.name
		#Cria o Cliente no CONTAS_CORRENTES ....as already exists records...
		
		if (frappe.db.sql("""select cc_nome_cliente from `tabCONTAS_CORRENTES` WHERE cc_nome_cliente =%s """,clientes.name, as_dict=False)) == ():
			print " CLIENTE NAO EXISTE"
			print clientes.name
			ccorrente = frappe.new_doc("CONTAS_CORRENTES")
			ccorrente.cc_nome_cliente = clientes.name
			ccorrente.name = clientes.name
			ccorrente.cc_status_conta_corrente = "Não Pago"
			ccorrente.insert()

			print "CONTAS CORRENTES FEITA !!!!!!"		
		get_bar_restaurante_cc(clientes.name)


@frappe.whitelist()
def get_bar_restaurante_cc(cliente):
	print "cliente BAR ",cliente

	for cc in frappe.db.sql("""select name,status_atendimento,conta_corrente,conta_corrente_status,total_servicos,hora_atendimento from tabBAR_RESTAURANTE where conta_corrente = %s """,cliente,as_dict=True):
		print cc.name
		print 	
		ccdetalhes = frappe.db.get_value("CC_detalhes",cc.name,"numero_registo")

#		ccdetalhes = frappe.db.sql("""SELECT name,parent,numero_registo,descricao_servico,status_conta_corrente from tabCC_detalhes where numero_registo = %s """,cc.name,as_dict=True)

		if ccdetalhes:
			#Registo existe
			print "registo ", ccdetalhes
			print "REGISTO BAR EXISTE"
			totalextra = 0
			cc_detalhes = frappe.get_doc("CC_detalhes",ccdetalhes)	
			#cc_detalhes = frappe.new_doc("CC_detalhes")
			#cc_detalhes.parent = ccorrente.name
			#cc_detalhes.parentfield = "cc_bar_restaurante"
			#cc_detalhes.parenttype = "CONTAS_CORRENTES"
					
				#	print extras.nome_servico
				#	print self.name
			#cc_detalhes.descricao_servico = cc.name
			#cc_detalhes.numero_registo = cc.name
			#cc_detalhes.data_registo = cc.hora_atendimento

			if cc_detalhes.total != cc.total_servicos: 
				cc_detalhes.total = cc.total_servicos #extras.total_extra

			if cc_detalhes.status_conta_corrente != cc.conta_corrente_status:
				cc_detalhes.status_conta_corrente = cc.conta_corrente_status #"Não Pago"

			totalextra = totalextra + flt(cc.total_servicos) #extras.total_extra
					
			cc_detalhes.save()

			#print (ccorrente.cc_valor_divida + totalextra)
			#ccorrente.cc_valor_divida = flt(ccorrente.cc_valor_divida) + totalextra
			#ccorrente.save()


		else:
			#Nao exist
		
			print "REGISTO BAR NAO EXISTE"
			totalextra = 0

			cc_detalhes = frappe.new_doc("CC_detalhes")
			cc_detalhes.parent = cliente
			cc_detalhes.parentfield = "cc_bar_restaurante"
			cc_detalhes.parenttype = "CONTAS_CORRENTES"
					
			print "cc nome", cc.name
			print "status ", str(cc.conta_corrente_status)
			print "valor ", cc.total_servicos
			print "hora ", cc.hora_atendimento

			cc_detalhes.descricao_servico = cc.name

			cc_detalhes.numero_registo = cc.name
			cc_detalhes.total = cc.total_servicos #extras.total_extra
			cc_detalhes.data_registo = cc.hora_atendimento
			cc_detalhes.status_conta_corrente = cc.conta_corrente_status #"Não Pago"
			cc_detalhes.tipo = "Bar"
#			cc_detalhes.name = cc.name #self.name
			cc_detalhes.idx += 1	
					
			cc_detalhes.insert()

			totalextra = totalextra + flt(cc.total_servicos) #extras.total_extra

			#print (ccorrente.cc_valor_divida + totalextra)
			#ccorrente.cc_valor_divida = flt(ccorrente.cc_valor_divida) + totalextra
			#ccorrente.save()

	#Update Quartos records too
	get_quartos_cc(cliente)

	#Call Ordem IDX
	ordem_idx(cliente)
			


@frappe.whitelist()
def get_quartos_cc(cliente):
	print "cliente QUARTOS ",cliente


	for cc in frappe.db.sql("""select name,status_reserva,conta_corrente,conta_corrente_status,total,total_servicos,hora_entrada from tabGESTAO_QUARTOS where conta_corrente = %s and status_reserva='Fechado' """,cliente,as_dict=True):
		print cc.name
		print 	
		ccdetalhes = frappe.db.get_value("CC_detalhes",cc.name,"numero_registo")

#		ccdetalhes = frappe.db.sql("""SELECT name,parent,numero_registo,descricao_servico,status_conta_corrente from tabCC_detalhes where numero_registo = %s """,cc.name,as_dict=True)

		if ccdetalhes:
			#Registo existe
			print "registo ", ccdetalhes
			print "REGISTO QUARTO EXISTE"
			totalextra = 0
			cc_detalhes = frappe.get_doc("CC_detalhes",ccdetalhes)	
			#cc_detalhes = frappe.new_doc("CC_detalhes")
			#cc_detalhes.parent = ccorrente.name
			#cc_detalhes.parentfield = "cc_bar_restaurante"
			#cc_detalhes.parenttype = "CONTAS_CORRENTES"
					
				#	print extras.nome_servico
				#	print self.name
			#cc_detalhes.descricao_servico = cc.name
			#cc_detalhes.numero_registo = cc.name
			#cc_detalhes.data_registo = cc.hora_atendimento

			if cc_detalhes.total != cc.total: 
				cc_detalhes.total = cc.total #extras.total_extra

			if cc_detalhes.total_servicos != cc.total_servicos: 
				cc_detalhes.total_servicos = cc.total_servicos #extras.total_extra


			if cc_detalhes.status_conta_corrente != cc.conta_corrente_status:
				cc_detalhes.status_conta_corrente = cc.conta_corrente_status #"Não Pago"

			totalextra = totalextra + flt(cc.total_servicos)  + flt(cc.total) #extras.total_extra
					
			cc_detalhes.save()

			#print (ccorrente.cc_valor_divida + totalextra)
			#ccorrente.cc_valor_divida = flt(ccorrente.cc_valor_divida) + totalextra
			#ccorrente.save()


		else:
			#Nao exist
		
			print "REGISTO QUARTO NAO EXISTE"
			totalextra = 0

			cc_detalhes = frappe.new_doc("CC_detalhes")
			cc_detalhes.parent = cliente
			cc_detalhes.parentfield = "cc_bar_restaurante"
			cc_detalhes.parenttype = "CONTAS_CORRENTES"
					
			print "cc nome", cc.name
			print "status ", str(cc.conta_corrente_status)
			print "valor ", cc.total_servicos
			print "hora ", cc.hora_entrada

			cc_detalhes.descricao_servico = cc.name

			cc_detalhes.numero_registo = cc.name
			cc_detalhes.total = cc.total #extras.total_extra
			cc_detalhes.total_servicos = cc.total_servicos #extras.total_extra
			cc_detalhes.data_registo = cc.hora_entrada
			cc_detalhes.status_conta_corrente = cc.conta_corrente_status #"Não Pago"
			cc_detalhes.tipo = "Quarto"
#			cc_detalhes.name = cc.name #self.name
			cc_detalhes.idx += 1	
					
			cc_detalhes.insert()

			totalextra = totalextra + flt(cc.total_servicos) + flt(cc.total) #extras.total_extra

			#print (ccorrente.cc_valor_divida + totalextra)
			#ccorrente.cc_valor_divida = flt(ccorrente.cc_valor_divida) + totalextra
			#ccorrente.save()

		#Call Ordem IDX
		ordem_idx(cliente)	

@frappe.whitelist()
def set_quartos_cc(cliente):
	quarto = frappe.get_doc("GESTAO_QUARTOS",cliente)
	quarto.conta_corrente_status = "Pago"
	quarto.save()
		
@frappe.whitelist()
def set_bar_cc(cliente):
	bar = frappe.get_doc("BAR_RESTAURANTE",cliente)
	bar.conta_corrente_status = "Pago"
	bar.save()

@frappe.whitelist()
def set_bar_quartos_cc(cliente):
	print "+++++++++++++++++++++++"
	print "+++++++++++++++++++++++"
	print "+++++++++++++++++++++++"
	print "CONTA cliente PAGAR ",cliente


	for client in frappe.db.sql("""SELECT name,parent,numero_registo,descricao_servico,status_conta_corrente,cc_tipo from tabCC_detalhes where parent = %s """,cliente,as_dict=True):

		print "registo ", client.name
		if client.cc_tipo == "Bar":
			print "pagar Bar"
			bar = frappe.get_doc("BAR_RESTAURANTE",client.name)
			bar.conta_corrente_status = "Pago"
			bar.save()

		elif client.cc_tipo == "Quarto":
			print "pagar Quarto"
			quarto = frappe.get_doc("GESTAO_QUARTOS",client.name)
			quarto.conta_corrente_status = "Pago"
			quarto.save()

		cc = frappe.get_doc("CC_detalhes",client.name)
		cc.status_conta_corrente = "Pago"
		cc.save()
