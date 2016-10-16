import frappe
from frappe import utils 
import datetime 
from frappe.model.naming import make_autoname
import frappe.async
from frappe.utils import cstr
from frappe import _

@frappe.whitelist()
def get_quartos(start, end):
	
	if not frappe.has_permission("GESTAO_QUARTOS","read"):
		raise frappe.PermissionError

	return frappe.db.sql("""select
		hora_entrada, hora_saida,
		nome_quarto, status,
		0 as all_day
	from `tabGESTAO_QUARTOS`
	where hora_entrada >= %(start)s and hora_saida <= %(end)s """, {
		"start": start,
		"end": end
	}, as_dict=True)
		


@frappe.whitelist()
def get_gestao_quartos_check(quarto):

	r= frappe.db.sql("""select numero_quarto, status
	from `tabGESTAO_QUARTOS`
	where status="Ocupado" and numero_quarto = %s """,(quarto), as_dict=False)
	print r
	return r


@frappe.whitelist()
def verifica_check_in():

		# loop no Doc a procura de quartos com limite da DATA de ENTRADA.

		for d in frappe.db.sql("""SELECT codigo,numero_quarto,check_in,check_out,reservation_status, pay_advance FROM `tabRESERVAS` WHERE reservation_status = "Nova" and check_in <=%s """, frappe.utils.now(), as_dict=True):
			print "RESERVAS +++++++++++++++++++++++++++++++"
			if (frappe.utils.data.time_diff_in_hours(frappe.utils.now(),d.check_in) >2):
				
				reser = frappe.get_doc("RESERVAS",d.codigo)
				dd= datetime.datetime.fromtimestamp(frappe.utils.data.time_diff_in_hours(frappe.utils.now(),d.check_in)).strftime('%H:%M:%S')
# str(frappe.utils.data.time_diff_in_hours(frappe.utils.now(),d.check_in))

				ddd = make_autoname('CANCEL/' + '.#####')
				print " Numer " + ddd
				frappe.db.sql("INSERT into tabCommunication  (name,docstatus,seen,unread_notification_sent,subject,reference_name,reference_doctype,sent_or_received,content,communication_type,creation,modified) values (%s,0,0,0,'RESERVA Cancelada ',%s,'RESERVAS','Sent','RESERVA Cancelada  <!-- markdown -->','Comment',%s,%s) ",(ddd,d.codigo,frappe.utils.now(),frappe.utils.now()))

				reser._comments =[{"comment": "Reserva " + d.codigo + " " + str(d.check_in) + " Cancelada por mais de " + datetime.datetime.fromtimestamp(dd).strftime('%H:%M:%S') + " horas <!-- markdown -->","by": "Scheduler", "name":ddd}]

				print " AGORA " + frappe.utils.now()
				print " CHECK IN " + str(d.check_in)
				print "Reserva " + d.codigo + " " + str(d.check_in) + " Cancelada por mais de " + dd + " horas"
				reser.reservation_status="Cancelada"
				reser.save()
				#frappe.redirect_to_message(_('INFORMACAO RESERVAS'),"<div>RESERVA " + d.codigo + " FOI CANCELADA </div>")	
				frappe.publish_realtime(event='msgprint', message='RESERVA ' + d.codigo + ' ' + str(d.check_in) + ' Cancelada por mais de ' + datetime.datetime.fromtimestamp(dd).strftime('%H:%M:%S') + ' horas', user=frappe.session.user,doctype='RESERVAS')	


@frappe.whitelist()
def verifica_hora_saida():

		print "HORA SAIDA QUARTOS CCCCCCCCCCCCCCCCCCCCCCCC"
		# loop no Doc a procura de quartos com limite da DATA de ENTRADA.

		for d in frappe.db.sql("""SELECT name,numero_quarto,hora_entrada,hora_saida,status_reserva FROM `tabGESTAO_QUARTOS` WHERE status_reserva = "Ocupado" and hora_saida <=%s """, frappe.utils.now(), as_dict=True):
#			print "MINUTOS " + (frappe.utils.data.time_diff_in_seconds(frappe.utils.now(),d.hora_entrada)/60)


			if (frappe.utils.data.time_diff_in_hours(frappe.utils.now(),d.hora_saida) <= 1): 
				# Avisa que passou do tempo...menos de 1 hora
				print " Menos de 1 hora"
				frappe.publish_realtime('msgprint','Este Quarto ja passou da hora. ' + str(frappe.utils.data.time_diff_in_seconds(frappe.utils.now(),d.hora_entrada)/60) + ' minutos a mais.' , user=frappe.session.user)
			elif (frappe.utils.data.time_diff_in_hours(frappe.utils.now(),d.hora_saida) > 1):
				frappe.publish_realtime(event='msgprint',message='MENSAGEM QUARTOS')
				print " MAIS de 1 hora " + d.name
				reser = frappe.get_doc("GESTAO_QUARTOS",d.name)
				print reser.numero_quarto
#				dd= datetime.datetime.fromtimestamp(frappe.utils.data.time_diff_in_seconds(frappe.utils.now(),datetime.datetime(2016, 10, 15, 20, 34, 2))).strftime('%M:%S')
				dd= datetime.datetime.fromtimestamp(frappe.utils.data.time_diff_in_seconds(frappe.utils.now(),d.hora_entrada)).strftime('%M:%S')
# str(frappe.utils.data.time_diff_in_seconds(frappe.utils.now(),d.hora_entrada))
				ddd = make_autoname(d.name +'AVISO/' + '.###')
				frappe.db.sql("INSERT into tabCommunication  (name,docstatus,seen,unread_notification_sent,subject,reference_name,reference_doctype,sent_or_received,content,communication_type,creation,modified) values (%s,0,0,0,'HORA DE SAIDA Expirada ',%s,'GESTAO_QUARTOS','Sent','HORA SAIDA Expirada  <!-- markdown -->','Comment',%s,%s) ",(ddd,d.name,frappe.utils.now(),frappe.utils.now()))

				reser._comments = "Hora de Saida por mais de " + dd + " minutos"
				print " AGORA " + frappe.utils.now()
				print " hora_saida " + str(d.hora_saida)
				print "QUARTO " + d.numero_quarto + " " + str(d.hora_saida) + " Cancelada por mais de " + dd + " horas"
				print " USER " + frappe.session.user
				reser.save()
				frappe.publish_realtime(event='msgprint', message='QUARTO ' + d.numero_quarto + ' ' + str(d.hora_saida) + ' Cancelada por mais de ' + dd + ' Horas/Minutos', user=frappe.session.user,doctype='GESTAO_QUARTOS')



@frappe.whitelist()
def verifica_mesas_vendidas(start):			
	return frappe.db.sql("""select
		hora_atendimento, name,
		total_servicos,pagamento_por, status_atendimento
	from `tabBAR_RESTAURANTE`
	where hora_atendimento >= %(start)s and hora_atendimento <= %(end)s """, {
		"start": start,
		"end": frappe.utils.now()
	}, as_dict=True)


@frappe.whitelist()
def caixa_movimentos_in(start,caixa,fecho):

		total_tpa = 0
		total_ccorrente = 0
		total_caixa = 0
		for d in  frappe.db.sql("""select hora_atendimento, name,total_servicos,pagamento_por, status_atendimento, bar_tender from `tabBAR_RESTAURANTE` where status_atendimento ='Fechado' and hora_atendimento >= %(start)s and hora_atendimento <= %(end)s """, {"start": start,"end": frappe.utils.now()	}, as_dict=True):
			
#for d in frappe.db.sql("""SELECT codigo,numero_quarto,check_in,check_out,reservation_status, pay_advance FROM `tabRESERVAS` WHERE reservation_status = "Nova" and check_in <=%s """, frappe.utils.now(), as_dict=True):
			print "MOVIMENTOS BAR RESTAURANTE +++++++++++++++++++++++++++++++"
			ddd = make_autoname('MOV-' + '.#####')
			if len(frappe.db.sql("SELECT name,descricao_movimento from tabMovimentos_Caixa WHERE descricao_movimento=%(mov)s""",{"mov":d.name}, as_dict=True))==0:
				frappe.db.sql("INSERT into tabMovimentos_Caixa (name, docstatus, parent, parenttype, parentfield, tipo_pagamento, descricao_movimento, valor_pago, hora_atendimento, creation, modified, usuario_movimentos) values (%s,0,%s,'CAIXA_Registadora','movimentos_caixa',%s,%s,%s,%s,%s,%s,%s) ",(ddd, caixa, d.pagamento_por ,d.name, d.total_servicos, d.hora_atendimento, frappe.utils.now(), frappe.utils.now(),d.bar_tender))
				total_caixa = d.total_servicos+total_caixa
				if (d.pagamento_por == "TPA"):
					total_tpa = d.total_servicos+total_tpa
				
				if (d.pagamento_por == "Conta-Corrente"):
					total_ccorrente = d.total_servicos+total_ccorrente
		print "Abre Caixa"
		print total_caixa
		reser = frappe.get_doc("CAIXA_Registadora",caixa)
		if (total_caixa > 1) and (reser.amount_caixa == 0):
			reser.amount_caixa = total_caixa+reser.amount_caixa
			reser.amount_tpa = total_tpa+reser.amount_tpa
			reser.amount_conta_corrente = total_ccorrente+reser.amount_conta_corrente
			reser.status_caixa='Em Curso'
			reser.save()
		elif (total_caixa > 1) and (reser.amount_caixa >= 0):
			reser.amount_caixa = total_caixa+reser.amount_caixa
			reser.amount_tpa = total_tpa+reser.amount_tpa
			reser.amount_conta_corrente = total_ccorrente+reser.amount_conta_corrente
			reser.save()
		print fecho
		print reser.status_caixa
		if (fecho==2):
			reser.status_caixa='Fechado'
			reser.save()

		

		return total_caixa

@frappe.whitelist()
def check_caixa_aberto():

	if (frappe.db.sql("""select name from `tabCAIXA_Registadora` WHERE status_caixa ='Aberto' """, as_dict=False)) != ():
		print "AAAAAAAAAAAAAAAAAAAA"
		return frappe.db.sql("""select name from `tabCAIXA_Registadora` WHERE status_caixa ='Aberto' """, as_dict=False)
	elif (frappe.db.sql("""select name from `tabCAIXA_Registadora` WHERE status_caixa ='Em Curso' """, as_dict=False)) != ():
		print "BBBBBBBBBBBBBBBBBBB"
		return frappe.db.sql("""select name from `tabCAIXA_Registadora` WHERE status_caixa ='Em Curso' """, as_dict=False)

