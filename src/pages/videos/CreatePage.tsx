import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, Toaster } from 'sonner'
import CreateSection from '../../components/module/content/CreateSection'
import EditSection from '../../components/module/content/EditSection'
import ViewDataCard from '../../components/module/content/ViewDataCard'
import Button from '../../components/ui/Button'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import Modal from '../../components/ui/Modal'
import { GetContentSection } from '../../interfaces/apis/getContentSection.interface'
import { contentService } from '../../services/content.service'
function CreatePages() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dataItemDelete, setDataItemDelete] = useState<GetContentSection | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isCreateOpen, setIsCreteOpen] = useState(false)
  const [itemEdit, setItemEdit] = useState<GetContentSection | null>(null)
  const handleSetItemEdit = useCallback((item: GetContentSection) => {
    setItemEdit(item)
  }, [])
  const { data: dataSection, isLoading, isError } = useQuery<GetContentSection[]>({
    queryKey: ['getSections'],
    queryFn: contentService.getSections,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  })
  const queryClient = useQueryClient()
  const deleteMutation = useMutation({
    mutationFn: (idSection: string) => contentService.deleteSection(idSection),
    onSuccess: () => {
      toast.success('Seccion eliminada correctamente'),
        setIsModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['getSections'] })
    }
  })
  const navigate = useNavigate()
  useEffect(() => {
    if (isError) {
      navigate('/login')
    }
  }, [isError, navigate])
  const onEdit = (item: GetContentSection) => {
    // Lógica para editar el video
    handleSetItemEdit(item)
    setIsEditOpen(true)
  }

  const onDelete = (item: GetContentSection) => {
    setIsModalOpen(true)
    setDataItemDelete(item)
  }
  const onView = (item: unknown) => {
    // Lógica para eliminar el video
    console.log(item)
    navigate(`/section/${item.id}`)
  }

  return (
    <main>
      <Toaster richColors theme='dark' />
      <div className='flex gap-4'>
        <h2 className="text-3xl font-bold">Gestión de contenido</h2>
        <Button
          icon={Plus}
          inverted
          fullWidth={false}
          onClick={() => {
            setIsCreteOpen(true)
          }}
        >
          Crear
        </Button>
      </div>
      <div className='p-4'>
        {
          isLoading ? <>
            <div className='text-center flex flex-col gap-2'>
              <span className='text-lg font-light'>Cargando datos</span>
              <LoadingSpinner />
            </div>

          </> : <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {dataSection?.map((item) => {
              return <ViewDataCard
                key={item.id}
                item={item}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
                renderContent={() => (
                  <>
                    <div>
                      <img src={item.imagenUrl} alt={item.title} className='rounded-lg shadow-2xl' />
                    </div>
                    <div>
                      <h1 className='pt-2 font-bold'>{item.title}</h1>
                      <span className='font-normal text-xs rounded-xl px-2 py-1 mt-1 bg-cyan-800'>{item.name}</span>
                      <h1 className='pt-2 text-sm font-normal text-gray-500'>{item.description}</h1>
                    </div>
                  </>
                )
                } />;
            }) ?? []}
          </section>
        }
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Eliminar seccion"
        theme="danger"
        size="md"  // "sm", "md", "lg", "xl", "full"
        footer={
          <div className="flex justify-end gap-2">
            <Button theme='neutral' onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button theme='danger' onClick={() => {
              if (dataItemDelete) {
                deleteMutation.mutate(dataItemDelete.id)
              }
            }}>Aceptar</Button>
          </div>
        }
      >
        <p>¿Deseas eliminar la seccion?</p>
        <span>{dataItemDelete?.title}</span>
      </Modal>
      <EditSection item={itemEdit} isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}></EditSection>
      <CreateSection isOpen={isCreateOpen} onClose={() => setIsCreteOpen(false)}></CreateSection>
    </main>
  )
}

export default CreatePages