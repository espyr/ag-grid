export interface RawDataItem {
  "@odata.etag": string;
  modifiedon: string;
  createdon: string;
  osp_documentacionid: string;
  osp_nombre: string;
  _ownerid: string;
  _ownerid_value: string;
  osp_registro: string;
  _osp_oportunidad_value: string;
  osp_tipificacion: number | null;
  osp_proyecto: boolean;
  osp_descripcion: string | null;
  osp_link: string;
  osp_categoria: number | null;
  _modifiedby: string;
  _modifiedby_value: string;
  osp_subcategoria: number | null;
  osp_validadocontratacion: boolean;
  osp_validadoordering: boolean;

  "osp_categoria@OData.Community.Display.V1.FormattedValue"?: string;
  "osp_tipificacion@OData.Community.Display.V1.FormattedValue"?: string;
  "osp_validadocontratacion@OData.Community.Display.V1.FormattedValue"?: string;
  "osp_validadoordering@OData.Community.Display.V1.FormattedValue"?: string;

  "_modifiedby_value@Microsoft.Dynamics.CRM.lookuplogicalname"?: string;
  "_osp_oportunidad_value@Microsoft.Dynamics.CRM.associatednavigationproperty"?: string;
  "_osp_oportunidad_value@Microsoft.Dynamics.CRM.lookuplogicalname"?: string;
  "_osp_oportunidad_value@OData.Community.Display.V1.FormattedValue"?: string;
  "_ownerid_value@Microsoft.Dynamics.CRM.associatednavigationproperty"?: string;
  "_ownerid_value@Microsoft.Dynamics.CRM.lookuplogicalname"?: string;
}
