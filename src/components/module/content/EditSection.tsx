import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Languages } from "lucide-react";
import { useEffect } from "react";
import { toast, Toaster } from "sonner";
import * as Yup from 'yup';
import { GetContentSection } from "../../../interfaces/apis/getContentSection.interface";
import { contentService } from "../../../services/content.service";
import Button from "../../ui/Button";
import Dropdown from "../../ui/Dropdown";
import Dropzone from "../../ui/Dropzone";
import Input from "../../ui/Input";
import Sidebar from "../../ui/Sidebar";
interface IEditSection {
  item: GetContentSection | null;
  isOpen: boolean;
  onClose: () => void;
}

function EditSection({ item, isOpen, onClose }: IEditSection) {
  const queryClient = useQueryClient();
  const updateSectionMutation = useMutation({
    mutationFn: ({ idSection, data }: { idSection: string; data: FormData }) =>
      contentService.updateSection(data, idSection),
    onSuccess: () => {
      toast.success('Actualizado correctamente')
      onClose(),
      queryClient.invalidateQueries({ queryKey: ['getSections'] });
    },
    onError: () => {
      toast.error('Ocurrio un error')
    }
  });
  const validationSchema = Yup.object({
    title: Yup.string().required('El titulo es requerido').min(10, 'Debe tener minimo 10 caracteres'),
  })
  const formik = useFormik({
    initialValues: {
      name: '',
      title: '',
      description: '',
      lang: '',
      imagenUrl: null
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      if (values.imagenUrl) {
        formData.append('imagenUrl', values.imagenUrl);
      }
      formData.append('name', values.name);
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('lang', values.lang);

      const idSection = item ? item?.id : ''
      console.log(idSection)
      console.log(formData)
      updateSectionMutation.mutate({ idSection: idSection, data: formData });
    },
  });
  const handleDropFile = (file: File[]) => {
    console.log('El file', file)
    formik.setFieldValue('imagenUrl', file[0])
  }
  useEffect(() => {
    if (item && item.title !== formik.values.title) {
      formik.setFieldValue('title', item.title);
    }
    if (item && item.description !== formik.values.description) {
      formik.setFieldValue('description', item.description);
    }
    if (item && item.name !== formik.values.name) {
      formik.setFieldValue('name', item.name);
    }
    if (item && item.lang !== formik.values.lang) {
      formik.setFieldValue('lang', item.lang);
    }
  }, [item]);
  return (
    <>
      <Toaster/>
      <Sidebar
        isOpen={isOpen}
        onClose={() => onClose()}
        title="Editar sección"
        theme="primary"
        position="right"  // "left" o "right"
        width="full"  // "xs", "sm", "md", "lg", "xl", "full"
      >
        <div className='p-4 flex flex-col gap-2'>
          <Input
            label="Nombre de la seccion"
            value={formik.values.name}
            type="text"
            name="name"
            theme="danger"
            onChange={formik.handleChange}
            placeholder="Título..."
            error={!!formik.errors.name}
            errorMessage={formik.errors.name}
          />
          <Input
            label="Titulo"
            value={formik.values.title}
            type="text"
            name="title"
            theme="danger"
            onChange={formik.handleChange}
            placeholder="Título..."
            error={!!formik.errors.title}
            errorMessage={formik.errors.title}
          />
          <Input
            label="Descripcion"
            value={formik.values.description}
            type="text"
            name="description"
            theme="primary"
            onChange={formik.handleChange}
            placeholder="Título..."
            error={!!formik.errors.description}
            errorMessage={formik.errors.description}
          />
          <Dropzone
            onDrop={(files) => handleDropFile(files)}
            accept="image/*"  // Tipos MIME aceptados
            multiple={false}           // Permitir múltiples archivos
            maxSize={5 * 1024 * 1024} // Tamaño máximo (5MB)
            maxFiles={1}              // Número máximo de archivos
            showPreview={true}        // Mostrar vista previa
            theme="primary"           // Tema visual
          />
          <Dropdown
            label="Idioma"
            icon={Languages}  // Ícono opcional
            theme="neutral"
            direction="down"  // o "up", "left", "right"
            items={[
              {
                children: 'Español',
                icon: Languages,
                onClick: () => formik.setFieldValue('lang', 'es')
              },
              {
                children: 'Ingles',
                icon: Languages,
                onClick: () => formik.setFieldValue('lang', 'en')
              }
            ]}
          />
          <label htmlFor="">Idioma actual: {formik.values.lang}</label>
          <Button
            type="submit"
            onClick={() => formik.handleSubmit()}
          >
            Enviar
          </Button>
        </div>
      </Sidebar>
    </>
  );
}

export default EditSection;
