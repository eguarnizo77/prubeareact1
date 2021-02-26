import React, {forwardRef, useState, useEffect} from 'react';
import './App.css';
import MaterialTable from 'material-table';
import axios from 'axios';
import {Modal, TextField, Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
//import SmartSticky from 'react-smart-sticky';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />)    
  };


const baseUrl = "https://raw.githubusercontent.com/sapardo10/content/master/RH.json"
const columnas = [{title:'Id', field:'id'}, {title:'Nombre', field:'name'}, {title:'Posición', field:'position'}, {title:'sueldo', field:'wage', type: 'numeric'}                  ];
const columnasSubEmp = [{title:'Id', field:'id'}, {title:'Nombre', field:'name'}, {title:'Posición', field:'position'}, {title:'sueldo', field:'wage', type: 'numeric'},
                        {title:'Estado', field:'estado', lookup: { 'N': 'Nuevo', 'A': 'Antiguo'}}];


function App() {
  const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputMaterial:{
      width: '100%'
    },
    paper: {   
      overflow:'scroll',   
      top:'10%',
      height:'100%',
      maxHeight: 500,
      position: 'absolute',
      width: 1000,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: '10px 10px 10px 0px #61d6fb',
      padding: theme.spacing(2, 4, 3),
    },
  }));
  const styles = useStyles();
  const [data, setData] = useState([]);
  const [modalVisualizar, setModalVisualizar] = useState(false);
  const [seleccionar, setSeleccionar] = useState({
    id: "",
    name: "",
    position: "",
    wage: "",
    estado: ""
  })
  const [dataEmp, setDataEmp] = useState(seleccionar);  
  const [dataAnt, setDataAnt] = useState(seleccionar);

  const seleccionarItem = (item) =>{      
    setSeleccionar(item);
    setDataEmp(item.employees);
    setDataAnt(item.employees);
    abrirCerrarModal();
  }
  const peticion = async()=>{
    await axios.get(baseUrl)
    .then(response =>{      
      setData(response.data);      
    })
  }

  const abrirCerrarModal=()=>{
    setModalVisualizar(!modalVisualizar);    
  }

  useEffect(()=>{
    peticion();
  }, [])

  const AgregarEstado=(item)=>{    
    setSeleccionar(item);
    console.log(item);
    console.log(seleccionar.estado);
    if (seleccionar.estado == '') {
      seleccionar.estado = 'Nuevo'
    }else if (seleccionar.estado == 'Nuevo'){
      seleccionar.estado = 'Antiguo'      
    }else if(seleccionar.estado == 'Antiguo'){
      seleccionar.estado = 'Nuevo'
    }
    console.log(seleccionar.estado);
  }


  const bodyVisualizar=(    
    <div  className={styles.paper}>
      <h3>Visualizar Empleado</h3>
      <TextField className={styles.inputMaterial} label="Id" value={seleccionar&&seleccionar.id} disabled />
      <br/>
      <TextField className={styles.inputMaterial} label="Nombre" value={seleccionar&&seleccionar.name} disabled />
      <br/>
      <TextField className={styles.inputMaterial} label="Posición" value={seleccionar&&seleccionar.position} disabled />
      <br/>
      <TextField className={styles.inputMaterial} label="Sueldo" value={seleccionar&&seleccionar.wage} disabled />      
      <br/>
            
      <br/>
      <MaterialTable
        icons={tableIcons}
        columns={columnasSubEmp}
        data={dataEmp}
        title="Sub Empleados"
        editable={{
          onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataUpdate = [...dataEmp];
              const index = oldData.tableData.id;
              dataUpdate[index] = newData; 
                setDataEmp([...dataUpdate]);
                  
              resolve();
            }, 1000)
          }),

        }}                                 
      />
      <br/>
      <div align="rigth">
        <Button variant="contained" color="secondary" onClick={() => abrirCerrarModal()}>Cancelar</Button>
      </div>
    </div>    
  )

  return (
    <div>
      <MaterialTable
        icons={tableIcons}
        columns={columnas}
        data={data.employees}
        title="Empleados"
        actions={[
        {
          icon: tableIcons.Edit,
          tooltip: 'Seleccionar',
          onClick: (event, rowData) => seleccionarItem(rowData)
        }
        ]}                                   
      />


      <Modal 
      className={styles.modal}
      open={modalVisualizar}
      onClose={abrirCerrarModal}>
        {bodyVisualizar}
      </Modal>
    </div>
  );
}

export default App;

