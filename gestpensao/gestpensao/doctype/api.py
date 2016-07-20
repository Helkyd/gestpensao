import frappe

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

