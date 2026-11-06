import { router } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


export default function Nutriologa() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>¡Hola, Elián! 💗</Text>
      <Text style={styles.subtitulo}>
        Bienvenida al panel de TroyaFit
      </Text>

      <View style={styles.tarjeta}>
        <Text style={styles.icono}>📅</Text>
        <Text style={styles.nombre}>Disponibilidad</Text>
        <Text style={styles.descripcion}>
          Configura tus días y horarios para atender estudiantes.
        </Text>
        <TouchableOpacity
        style={styles.boton}
        onPress={() => router.push('/disponibilidad')}
>
        <Text style={styles.textoBoton}>Administrar horarios</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tarjeta}>
        <Text style={styles.icono}>🩺</Text>
        <Text style={styles.nombre}>Citas</Text>
        <Text style={styles.descripcion}>
          Consulta y administra las citas de los estudiantes.
        </Text>
        <TouchableOpacity
  style={styles.boton}
  onPress={() => router.push('/citas-nutriologa')}
>
  <Text style={styles.textoBoton}>Ver citas</Text>
</TouchableOpacity>
      </View>

      <View style={styles.tarjeta}>
        <Text style={styles.icono}>🥗</Text>
        <Text style={styles.nombre}>Menús personalizados</Text>
        <Text style={styles.descripcion}>
          Diseña y envía planes alimenticios a cada estudiante.
        </Text>
        <TouchableOpacity style={styles.boton}>
          <Text style={styles.textoBoton}>Administrar menús</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tarjeta}>
        <Text style={styles.icono}>👩‍🎓</Text>
        <Text style={styles.nombre}>Estudiantes</Text>
        <Text style={styles.descripcion}>
          Consulta la información de los estudiantes registrados.
        </Text>
       <TouchableOpacity
  style={styles.boton}
  onPress={() => router.push('/estudiantes-nutriologa')}
>
  <Text style={styles.textoBoton}>Ver estudiantes</Text>
</TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f1e8cf',
    padding: 22,
    paddingTop: 55,
  },
  titulo: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#1F416A',
  },
  subtitulo: {
    fontSize: 15,
    color: '#555',
    marginBottom: 25,
    marginTop: 5,
  },
  tarjeta: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 18,
    marginBottom: 17,
    elevation: 3,
  },
  icono: {
    fontSize: 30,
    marginBottom: 8,
  },
  nombre: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1F416A',
  },
  descripcion: {
    fontSize: 14,
    color: '#666',
    marginTop: 7,
    marginBottom: 15,
  },
  boton: {
    backgroundColor: '#4089C0',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
  },
});