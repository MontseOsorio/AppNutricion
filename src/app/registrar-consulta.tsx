
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = 'https://troyafit-api.onrender.com';
const ID_NUTRIOLOGA = 2;

export default function RegistrarConsulta() {
  const { id_estudiante } = useLocalSearchParams<{
    id_estudiante: string;
  }>();

  const [motivo, setMotivo] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [recomendaciones, setRecomendaciones] = useState('');
  const [seguimiento, setSeguimiento] = useState('');

  const [peso, setPeso] = useState('');
  const [estatura, setEstatura] = useState('');
  const [grasa, setGrasa] = useState('');
  const [observacionesMedicion, setObservacionesMedicion] =
    useState('');

  const [guardando, setGuardando] = useState(false);

  const guardarConsulta = async () => {
    if (!id_estudiante) {
      Alert.alert('Error', 'No se identificó al estudiante.');
      return;
    }

    try {
      setGuardando(true);

      const respuesta = await fetch(`${API_URL}/api/consultas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_estudiante: Number(id_estudiante),
          id_nutriologa: ID_NUTRIOLOGA,
          fecha_consulta: new Date().toISOString(),
          motivo,
          observaciones,
          diagnostico_nutricional: diagnostico,
          recomendaciones,
          seguimiento,
          peso_kg: peso,
          estatura_cm: estatura,
          porcentaje_grasa: grasa,
          observaciones_medicion: observacionesMedicion,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || 'No se pudo registrar la consulta.'
        );
      }

      Alert.alert(
        '¡Consulta registrada! 💗',
        'La consulta y sus mediciones se guardaron correctamente.',
        [
          {
            text: 'Aceptar',
            onPress: () => router.back(),
          },
        ]
      );

    } catch (error) {
      console.error('Error al guardar consulta:', error);

      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'No se pudo registrar la consulta.'
      );
    } finally {
      setGuardando(false);
    }
  };

  const campo = (
    titulo: string,
    valor: string,
    cambiarValor: (texto: string) => void,
    placeholder: string,
    multilinea = false,
    numerico = false
  ) => (
    <View style={styles.grupo}>
      <Text style={styles.etiqueta}>{titulo}</Text>
      <TextInput
        style={[
          styles.input,
          multilinea && styles.inputMultilinea,
        ]}
        value={valor}
        onChangeText={cambiarValor}
        placeholder={placeholder}
        placeholderTextColor="#999"
        multiline={multilinea}
        textAlignVertical={multilinea ? 'top' : 'center'}
        keyboardType={numerico ? 'decimal-pad' : 'default'}
      />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Nueva consulta 🩺</Text>

      <Text style={styles.subtitulo}>
        Registra la información de la atención nutricional.
      </Text>

      <View style={styles.tarjeta}>
        <Text style={styles.numero}>
          Expediente del estudiante: {id_estudiante}
        </Text>
      </View>

      <Text style={styles.seccion}>Información de la consulta</Text>

      {campo(
        'Motivo de consulta',
        motivo,
        setMotivo,
        '¿Por qué acude el estudiante?',
        true
      )}

      {campo(
        'Observaciones',
        observaciones,
        setObservaciones,
        'Observaciones generales de la consulta...',
        true
      )}

      {campo(
        'Diagnóstico nutricional',
        diagnostico,
        setDiagnostico,
        'Escribe el diagnóstico...',
        true
      )}

      {campo(
        'Recomendaciones',
        recomendaciones,
        setRecomendaciones,
        'Recomendaciones para el estudiante...',
        true
      )}

      {campo(
        'Seguimiento',
        seguimiento,
        setSeguimiento,
        'Indicaciones para la próxima consulta...',
        true
      )}

      <Text style={styles.seccion}>Mediciones del estudiante ⚖️</Text>

      {campo(
        'Peso (kg)',
        peso,
        setPeso,
        'Ej. 60.5',
        false,
        true
      )}

      {campo(
        'Estatura (cm)',
        estatura,
        setEstatura,
        'Ej. 155',
        false,
        true
      )}

      {campo(
        'Grasa corporal (%)',
        grasa,
        setGrasa,
        'Ej. 25',
        false,
        true
      )}

      {campo(
        'Observaciones de medición',
        observacionesMedicion,
        setObservacionesMedicion,
        'Notas adicionales sobre las mediciones...',
        true
      )}

      <TouchableOpacity
        style={[
          styles.boton,
          guardando && styles.botonDesactivado,
        ]}
        onPress={guardarConsulta}
        disabled={guardando}
        activeOpacity={0.8}
      >
        <Text style={styles.textoBoton}>
          {guardando ? 'Guardando...' : 'Guardar consulta'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f1e8cf',
    padding: 22,
    paddingTop: 55,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F416A',
  },
  subtitulo: {
    fontSize: 15,
    color: '#555',
    marginTop: 5,
    marginBottom: 20,
  },
  tarjeta: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 15,
    marginBottom: 15,
  },
  numero: {
    color: '#1F416A',
    fontWeight: 'bold',
    fontSize: 15,
  },
  seccion: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F416A',
    marginTop: 18,
    marginBottom: 15,
  },
  grupo: {
    marginBottom: 15,
  },
  etiqueta: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F416A',
    marginBottom: 7,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e5dfd2',
  },
  inputMultilinea: {
    minHeight: 85,
  },
  boton: {
    backgroundColor: '#4089C0',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  botonDesactivado: {
    opacity: 0.6,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
