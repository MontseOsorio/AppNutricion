
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const API_URL = 'https://troyafit-api.onrender.com';

interface Estudiante {
  id_usuario: number;
  nombre: string;
  apellidos: string;
  correo: string;
}

interface Medicion {
  id_medicion: number;
  fecha_medicion: string;
  peso_kg: number | null;
  estatura_cm: number | null;
  imc: number | null;
  porcentaje_grasa: number | null;
  porcentaje_agua: number | null;
  masa_grasa_kg: number | null;
  masa_muscular_kg: number | null;
  masa_osea_kg: number | null;
  edad_metabolica: number | null;
  grasa_visceral: number | null;
  sexo: string | null;
  edad: number | null;
  observaciones: string | null;
}

export default function MasDatos() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [historial, setHistorial] = useState<Medicion[]>([]);
  const [mostrarLista, setMostrarLista] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [peso, setPeso] = useState('');
  const [estatura, setEstatura] = useState('');
  const [grasa, setGrasa] = useState('');
  const [masaGrasa, setMasaGrasa] = useState('');
  const [agua, setAgua] = useState('');
  const [aguaKg, setAguaKg] = useState('');
  const [musculo, setMusculo] = useState('');
  const [hueso, setHueso] = useState('');
  const [edadMetabolica, setEdadMetabolica] = useState('');
  const [visceral, setVisceral] = useState('');
  const [sexo, setSexo] = useState('');
  const [edad, setEdad] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const imc =
    Number(peso) > 0 && Number(estatura) > 0
      ? (Number(peso) / ((Number(estatura) / 100) ** 2)).toFixed(2)
      : '';

  const obtenerEstudiantes = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/api/planes/estudiantes`);
      if (!respuesta.ok) throw new Error('No se pudieron cargar los estudiantes.');
      const datos = await respuesta.json();
      setEstudiantes(datos);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No fue posible cargar los estudiantes.');
    } finally {
      setCargando(false);
    }
  };

  const obtenerHistorial = async (id: number) => {
    try {
      const respuesta = await fetch(
        `${API_URL}/api/mediciones/estudiante/${id}`
      );
      if (!respuesta.ok) throw new Error('No se pudo consultar el historial.');
      const datos = await respuesta.json();
      setHistorial(datos);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo cargar el historial.');
    }
  };

  useEffect(() => {
    obtenerEstudiantes();
  }, []);

  const seleccionarEstudiante = (item: Estudiante) => {
    setEstudiante(item);
    setMostrarLista(false);
    setHistorial([]);
    obtenerHistorial(item.id_usuario);
  };

  const limpiarFormulario = () => {
    setPeso('');
    setEstatura('');
    setGrasa('');
    setMasaGrasa('');
    setAgua('');
    setAguaKg('');
    setMusculo('');
    setHueso('');
    setEdadMetabolica('');
    setVisceral('');
    setSexo('');
    setEdad('');
    setObservaciones('');
    setFecha(new Date().toISOString().slice(0, 10));
  };

  const registrarMedicion = async () => {
    if (!estudiante) {
      Alert.alert('Falta estudiante', 'Selecciona un estudiante.');
      return;
    }

    if (!fecha) {
      Alert.alert('Falta fecha', 'Ingresa la fecha de consulta.');
      return;
    }

    if (!peso || !estatura) {
      Alert.alert('Datos incompletos', 'Ingresa el peso y la estatura.');
      return;
    }

    if (Number(peso) <= 0 || Number(estatura) <= 0) {
      Alert.alert('Datos inválidos', 'El peso y la estatura deben ser mayores a cero.');
      return;
    }

    setGuardando(true);

    try {
      const respuesta = await fetch(`${API_URL}/api/mediciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_estudiante: estudiante.id_usuario,
          fecha_medicion: fecha,
          peso_kg: peso,
          estatura_cm: estatura,
          porcentaje_grasa: grasa,
          masa_grasa_kg: masaGrasa,
          porcentaje_agua: agua,
          agua_corporal_kg: aguaKg,
          masa_muscular_kg: musculo,
          masa_osea_kg: hueso,
          edad_metabolica: edadMetabolica,
          grasa_visceral: visceral,
          sexo,
          edad,
          observaciones,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudo guardar la medición.');
      }

      Alert.alert('¡Listo!', 'La medición se registró correctamente.');
      limpiarFormulario();
      obtenerHistorial(estudiante.id_usuario);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'No se pudo guardar.'
      );
    } finally {
      setGuardando(false);
    }
  };

  const campo = (
    etiqueta: string,
    valor: string,
    cambiar: (texto: string) => void,
    decimal = true
  ) => (
    <View style={styles.campo}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <TextInput
        style={styles.input}
        value={valor}
        onChangeText={cambiar}
        keyboardType={decimal ? 'decimal-pad' : 'numeric'}
        placeholder="Escribe aquí"
        placeholderTextColor="#999"
      />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Composición corporal 📊</Text>
      <Text style={styles.subtitulo}>
        Registra y consulta la evolución de cada estudiante.
      </Text>

      <View style={styles.tarjeta}>
        <Text style={styles.seccion}>1. Seleccionar estudiante</Text>

        <TouchableOpacity
          style={styles.selector}
          onPress={() => setMostrarLista(!mostrarLista)}
        >
          <Text style={styles.selectorTexto}>
            {estudiante
              ? `${estudiante.nombre} ${estudiante.apellidos}`
              : 'Seleccionar estudiante ▼'}
          </Text>
        </TouchableOpacity>

        {mostrarLista && estudiantes.map((item) => (
          <TouchableOpacity
            key={item.id_usuario}
            style={styles.opcion}
            onPress={() => seleccionarEstudiante(item)}
          >
            <Text style={styles.nombreOpcion}>
              {item.nombre} {item.apellidos}
            </Text>
            <Text style={styles.correo}>{item.correo}</Text>
          </TouchableOpacity>
        ))}

        {cargando && <ActivityIndicator color="#4089C0" />}
        {!cargando && estudiantes.length === 0 && (
          <Text style={styles.nota}>No hay estudiantes disponibles.</Text>
        )}
      </View>

      <View style={styles.tarjeta}>
        <Text style={styles.seccion}>2. Datos generales</Text>
        {campo('Fecha de consulta (AAAA-MM-DD)', fecha, setFecha, false)}
        {campo('Peso (kg)', peso, setPeso)}
        {campo('Estatura (cm)', estatura, setEstatura)}

        <View style={styles.imc}>
          <Text style={styles.imcEtiqueta}>Índice de masa corporal (IMC)</Text>
          <Text style={styles.imcValor}>{imc || '--'}</Text>
          <Text style={styles.nota}>Se calcula automáticamente.</Text>
        </View>

        {campo('Edad (años)', edad, setEdad, false)}
        <Text style={styles.etiqueta}>Sexo</Text>
        <View style={styles.fila}>
          {['Femenino', 'Masculino'].map((opcion) => (
            <TouchableOpacity
              key={opcion}
              style={[styles.opcionSexo, sexo === opcion && styles.seleccionado]}
              onPress={() => setSexo(opcion)}
            >
              <Text style={sexo === opcion ? styles.textoSeleccionado : styles.textoSexo}>
                {opcion}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.tarjeta}>
        <Text style={styles.seccion}>3. Composición corporal</Text>
        {campo('Porcentaje de grasa (%)', grasa, setGrasa)}
        {campo('Masa grasa (kg)', masaGrasa, setMasaGrasa)}
        {campo('Porcentaje de agua (%)', agua, setAgua)}
        {campo('Agua corporal (kg)', aguaKg, setAguaKg)}
        {campo('Masa muscular (kg)', musculo, setMusculo)}
        {campo('Masa ósea (kg)', hueso, setHueso)}
        {campo('Edad metabólica', edadMetabolica, setEdadMetabolica, false)}
        {campo('Grasa visceral', visceral, setVisceral)}
      </View>

      <View style={styles.tarjeta}>
        <Text style={styles.seccion}>4. Observaciones</Text>
        <TextInput
          style={[styles.input, styles.observaciones]}
          value={observaciones}
          onChangeText={setObservaciones}
          placeholder="Notas de la consulta..."
          placeholderTextColor="#999"
          multiline
        />

        <TouchableOpacity
          style={styles.boton}
          onPress={registrarMedicion}
          disabled={guardando}
        >
          {guardando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.textoBoton}>Guardar medición</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.tarjeta}>
        <Text style={styles.seccion}>5. Historial de mediciones</Text>

        {!estudiante ? (
          <Text style={styles.nota}>Selecciona un estudiante para ver su historial.</Text>
        ) : historial.length === 0 ? (
          <Text style={styles.nota}>Todavía no hay mediciones registradas.</Text>
        ) : (
          historial.map((item) => (
            <View key={item.id_medicion} style={styles.historialItem}>
              <Text style={styles.historialFecha}>
                {new Date(item.fecha_medicion).toLocaleDateString('es-MX')}
              </Text>
              <Text style={styles.historialDato}>Peso: {item.peso_kg ?? '--'} kg</Text>
              <Text style={styles.historialDato}>Estatura: {item.estatura_cm ?? '--'} cm</Text>
              <Text style={styles.historialDato}>IMC: {item.imc ?? '--'}</Text>
              <Text style={styles.historialDato}>Grasa: {item.porcentaje_grasa ?? '--'}%</Text>
              <Text style={styles.historialDato}>Agua: {item.porcentaje_agua ?? '--'}%</Text>
              <Text style={styles.historialDato}>Músculo: {item.masa_muscular_kg ?? '--'} kg</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f1e8cf',
    padding: 20,
    paddingTop: 55,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F416A',
  },
  subtitulo: {
    fontSize: 14,
    color: '#555',
    marginTop: 6,
    marginBottom: 20,
  },
  tarjeta: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,
    elevation: 3,
  },
  seccion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F416A',
    marginBottom: 15,
  },
  selector: {
    borderWidth: 1,
    borderColor: '#d5d5d5',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#fafafa',
  },
  selectorTexto: {
    color: '#1F416A',
    fontSize: 15,
  },
  opcion: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  nombreOpcion: {
    color: '#1F416A',
    fontWeight: 'bold',
  },
  correo: {
    color: '#777',
    fontSize: 12,
    marginTop: 3,
  },
  campo: {
    marginBottom: 13,
  },
  etiqueta: {
    color: '#444',
    fontWeight: '600',
    marginBottom: 7,
  },
  input: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 11,
    padding: 12,
    color: '#333',
    fontSize: 15,
  },
  imc: {
    backgroundColor: '#edf5fb',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  imcEtiqueta: {
    color: '#1F416A',
    fontWeight: 'bold',
  },
  imcValor: {
    color: '#4089C0',
    fontSize: 27,
    fontWeight: 'bold',
    marginTop: 5,
  },
  nota: {
    color: '#777',
    fontSize: 13,
    marginTop: 8,
  },
  fila: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  opcionSexo: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4089C0',
    alignItems: 'center',
  },
  seleccionado: {
    backgroundColor: '#4089C0',
  },
  textoSexo: {
    color: '#4089C0',
    fontWeight: 'bold',
  },
  textoSeleccionado: {
    color: '#fff',
    fontWeight: 'bold',
  },
  observaciones: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  boton: {
    backgroundColor: '#4089C0',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 18,
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  historialItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 13,
  },
  historialFecha: {
    color: '#1F416A',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  historialDato: {
    color: '#555',
    fontSize: 14,
    marginTop: 3,
  },
});
