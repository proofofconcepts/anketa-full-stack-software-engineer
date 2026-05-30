import 'dart:async';
import 'package:flutter/material.dart';

class SearchPage extends StatefulWidget {
  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  TextEditingController controller = TextEditingController();
  Timer? debounce;

  List<String> results = [];

  final users = [
    'Andres Rivero',
    'Carlos Perez',
    'Gabriel Silva',
    'Maria Gomez',
  ];

  void onSearchChanged(String query) {
    debounce = Timer(Duration(milliseconds: 500), () {
      setState(() {
        results = users
            .where((user) => user.toLowerCase().contains(query.toLowerCase()))
            .toList();
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: TextField(
        controller: controller,
        onChanged: onSearchChanged,
      ),
    );
  }
}
